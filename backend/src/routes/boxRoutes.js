import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { marked } from 'marked'; // npm install marked

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../../content/boxes');

async function boxRoutes(app, options) {

  // ✅ Serve static images: GET /api/content/boxes/box1/step1/...
  app.get('/content/*', async (request, reply) => {
    const filePath = path.join(__dirname, '../../content', request.params['*']);
    if (!fs.existsSync(filePath)) {
      return reply.code(404).send({ error: 'File not found' });
    }
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };
    reply.header('Content-Type', mimeTypes[ext] || 'application/octet-stream');
    return reply.send(fs.readFileSync(filePath));
  });

  // ✅ my-boxes MUST be before /:id to avoid route conflict
  app.get('/my-boxes', { preHandler: [app.authenticate] }, async (request, reply) => {
    try {
      const boxFolders = fs.readdirSync(CONTENT_DIR);
      const boxes = [];

      for (const folder of boxFolders) {
        const jsonPath = path.join(CONTENT_DIR, folder, `${folder}.json`);
        if (!fs.existsSync(jsonPath)) continue;

        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        boxes.push({
          boxId: data.boxId,
          name: data.title,
          description: data.description,
        });
      }

      return reply.send(boxes);
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Server error' });
    }
  });

  // ✅ Get full box with processed images and markdown
  app.get('/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params;
      const boxFolder = `box${id}`;
      const jsonPath = path.join(CONTENT_DIR, boxFolder, `${boxFolder}.json`);

      if (!fs.existsSync(jsonPath)) {
        return reply.code(404).send({ error: 'Box not found' });
      }

      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

      // Process each step: parse theory markdown + resolve images
      const processedSteps = data.steps.map(step => {
        // Parse theory markdown → HTML
        let theory = null;
        if (step.theoryPath) {
          const theoryFile = path.join(__dirname, '../../content', step.theoryPath);
          if (fs.existsSync(theoryFile)) {
            theory = marked(fs.readFileSync(theoryFile, 'utf-8'));
          }
        }

        // Process substeps
        const substeps = step.substeps.map(sub => {
          // Parse description markdown → HTML
          let description = '';
          if (sub.descriptionPath) {
            const descFile = path.join(__dirname, '../../content', sub.descriptionPath);
            if (fs.existsSync(descFile)) {
              description = marked(fs.readFileSync(descFile, 'utf-8'));
            }
          }

          // Resolve images → check existence + build URL
          const processedImages = (sub.images || []).map(imgPath => {
            const fullPath = path.join(__dirname, '../../content', imgPath);
            const exists = fs.existsSync(fullPath);
            return {
              path: imgPath,
              exists,
              // ✅ URL matches the /api/content/* route above
              url: `/api/content/${imgPath}`,
            };
          });

          return { ...sub, description, processedImages };
        });

        return { ...step, theory, substeps };
      });

      return reply.send({ ...data, steps: processedSteps });

    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Server error' });
    }
  });

  app.post('/unlock', { preHandler: [app.authenticate] }, async (request, reply) => {
    try {
      const { unlockCode } = request.body;

      if (!unlockCode) {
        return reply.code(400).send({ error: 'Missing unlockCode' });
      }

      const boxFolders = fs.readdirSync(CONTENT_DIR);
      let matchedBoxId = null;

      for (const folder of boxFolders) {
        const jsonPath = path.join(CONTENT_DIR, folder, `${folder}.json`);
        if (!fs.existsSync(jsonPath)) continue;

        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        if (data.unlockCode === unlockCode) {
          matchedBoxId = data.boxId;
          break;
        }
      }

      if (!matchedBoxId) {
        return reply.code(400).send({ error: 'Invalid unlock code' });
      }

      return reply.send({ message: 'Box unlocked successfully', boxId: matchedBoxId });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Server error' });
    }
  });
}

export default boxRoutes;