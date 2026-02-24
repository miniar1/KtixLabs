import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Chemin absolu vers content/ depuis le controller
const CONTENT_BASE = path.join(__dirname, '../../content');

export const getBox = async (req, reply) => {
  const { id } = req.params;

  const boxFolder = `box${id}`;
  const jsonPath = path.join(CONTENT_BASE, 'boxes', boxFolder, `${boxFolder}.json`);

  if (!fs.existsSync(jsonPath)) {
    return reply.code(404).send({ error: "Box not found" });
  }

  const boxData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  for (const step of boxData.steps) {

    // ✅ THEORY
    if (step.theoryPath) {
      const theoryPath = path.join(CONTENT_BASE, step.theoryPath);

      if (fs.existsSync(theoryPath)) {
        let html = marked(fs.readFileSync(theoryPath, "utf-8"));

        // 🔥 REWRITE IMAGE PATHS INSIDE MARKDOWN
        html = html.replace(
          /src="([^"]+)"/g,
          (match, src) => {
            const cleanPath = path.join(
              'boxes',
              boxFolder,
              src.replace('../', '')
            );
            return `src="/api/content/${cleanPath}"`;
          }
        );

        step.theory = html;
      }
    }

    // ✅ SUBSTEPS
    for (const sub of step.substeps) {

      if (sub.descriptionPath) {
        const descPath = path.join(CONTENT_BASE, sub.descriptionPath);

        if (fs.existsSync(descPath)) {
          let html = marked(fs.readFileSync(descPath, "utf-8"));

          // 🔥 SAME FIX FOR DESCRIPTION
          html = html.replace(
            /src="([^"]+)"/g,
            (match, src) => {
              const cleanPath = path.join(
                'boxes',
                boxFolder,
                src.replace('../', '')
              );
              return `src="/api/content/${cleanPath}"`;
            }
          );

          sub.description = html;
        }
      }

      // existing image handling (keep this)
      if (sub.images && Array.isArray(sub.images)) {
        sub.processedImages = sub.images.map((imagePath) => {
          const fullImagePath = path.join(CONTENT_BASE, imagePath);
          return fs.existsSync(fullImagePath)
            ? {
                path: imagePath,
                url: `/api/content/${imagePath}`,
                exists: true
              }
            : {
                path: imagePath,
                exists: false,
                error: 'Image not found'
              };
        });
      }
    }
  }

  return reply.send(boxData);
};
export const serveImage = async (req, reply) => {
  const { '*': filePath } = req.params;
  
  // The filePath will be something like "boxes/box1/step1/substep1/step1substep1.jpg"
  console.log('Requested file path:', filePath);
  
  const resolvedPath = path.join(CONTENT_BASE, filePath);
  console.log('Resolved path:', resolvedPath);

  // Sécurité : empêcher directory traversal
  if (!resolvedPath.startsWith(path.resolve(CONTENT_BASE))) {
    return reply.code(403).send({ error: "Access denied" });
  }

  if (!fs.existsSync(resolvedPath)) {
    console.log('File does not exist:', resolvedPath);
    return reply.code(404).send({ error: "File not found" });
  }

  const mimeTypes = {
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.png': 'image/png', '.gif': 'image/gif',
    '.webp': 'image/webp', '.svg': 'image/svg+xml',
  };

  const ext = path.extname(resolvedPath).toLowerCase();
  reply.type(mimeTypes[ext] || 'application/octet-stream');
  return reply.send(fs.createReadStream(resolvedPath));
};