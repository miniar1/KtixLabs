import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "content");

// ─── PASTE YOUR CONTENT HERE ────────────────────────────────────────────────
// Map of "boxes/box1/stepX/substepY/description.md" → markdown text
// Add every substep from your big MD file below.

const contentMap = {
"boxes/box1/step1/substep1/description.md": `# Unbox the Cabinet

The electrical cabinet arrives inside a protective cardboard box.

Carefully open the cardboard packaging.
Place the cabinet on a stable surface.
Open the cabinet door and take a good look at it, this is your blank canvas.`,

"boxes/box1/step2/substep1/description.md": `# Install Spacers

1. Position the spacers(#1) at the lowest mounting points.
2. Secure each spacer using the appropriate screws(#2).
3. Tighten firmly but avoid overtightening.

Ensure all spacers are aligned at the same height.`,

"boxes/box1/step2/substep2/description.md": `# Install Mounting Plate

1. Place the mounting plate(#3) inside the cabinet.
2. Align it with the installed spacers.
3. Secure it using the appropriate screws(#4).

The plate must sit flat and stable.`,

"boxes/box1/step2/substep3/description.md": `# Validation

✔ The mounting plate is aligned.  
✔ All screws are tightened properly.  
✔ The plate does not move when pressed.

If instability is detected, recheck spacer installation.`,

"boxes/box1/step3/substep1/description.md": `# Cut Cable Duct

Measure and cut cable ducts according to required dimensions.

For 40x40 cable duct(#):

* 2 pieces: 720 mm
* 4 pieces: 445 mm

For 25x40 cable duct:

* 1 piece: 445 mm
* 1 piece: 265 mm

Ensure cuts are straight and clean.
Remove burrs before installation.`,

"boxes/box1/step3/substep2/description.md": `# Attach Cable Duct

1. Use M5 hex key (#) to attach the cable duct in the specified order.
2. Secure the cable conduit with M5x10 hex head screws (#)

Cable ducts must be firmly fixed.`,

"boxes/box1/step3/substep3/description.md": `# Validation

✔ All cable ducts are securely mounted.  
✔ No sharp edges remain.  
✔ Layout matches the design drawing.`,

"boxes/box1/step4/substep1/description.md": `# Cut DIN Rail

Cut DIN rails(#) to the following lengths:

* 445 mm
* 380 mm
* 260 mm

Ensure clean cuts and remove sharp edges.`,

"boxes/box1/step4/substep2/description.md": `# Attach DIN Rail

1. Use M5 hex key to secure the DIN rail with M5x10 hex head screws

Rails must be straight and firmly attached.`,

"boxes/box1/step4/substep3/description.md": `# Validation

✔ DIN rails are aligned horizontally.  
✔ All screws are tightened securely.`,

"boxes/box1/step5/substep1/description.md": `# Prepare the Components

Collect the following components:

* Start Push Button(#)
* Stop Push Button(#)
* Emergency Stop (E-Stop)(#)
* Green Indicator Light(#)
* Red Indicator Light(#)
* Selector Switch(#)
* Circuit Breaker 32A(#)
* Contactor(#)
* 7x Circuit Breakers 16A(#)
* Terminal Distributor Box 1(#)

Verify all parts before installation.`,

"boxes/box1/step5/substep2/description.md": `# Install LED Indicators

1. Insert the green indicator into the cabinet door.
2. Insert the red indicator into the cabinet panel.
3. Tighten rear fixing screws.
4. Ensure correct orientation.`,

"boxes/box1/step5/substep3/description.md": `# Install Emergency Stop

1. The emergency Stop (#) is installed on the cabinet door.
2. Insert Emergency Stop.
3. Tighten the rear screw.`,

"boxes/box1/step5/substep4/description.md": `# Install Push Buttons

1. The Start Push Button (#) and Stop Push Button (#) are installed on the cabinet door.
2. Insert push button.
3. Tighten rear nut.`,

"boxes/box1/step5/substep5/description.md": `# Install Selector Switch

First, the selector switch (#) needs to be dissembled because the fully assembled switch cannot pass through the Ø22 mm hole:

* Remove the contact blocks (NO/NC) from the back (Unclip or gently pull them off)
* Unscrew the fixing nut (Remove washer and nut)
* Separate the parts: Head (front operator) + Body + Nut

The selector switch is installed on the cabinet's left side:
-Insert the head from the front side of the panel.
-Check orientation (AUTO / MANUAL horizontal).
-Reinstall washer and nut from the back.
-Tighten securely (do not overtighten).
-Reclip the contact blocks.`,

"boxes/box1/step5/substep6/description.md": `# Install 32A Circuit Breakers

1. Snap 32A breaker onto DIN rail.`,

"boxes/box1/step5/substep7/description.md": `# Install Contactor

1. Snap contactor(#) onto the DIN rail.`,

"boxes/box1/step5/substep8/description.md": `# Install 16A Circuit Breakers

1. Snap all 7 16A circuit breakers (# to #) onto the same DIN rail, side by side.`,

"boxes/box1/step5/substep9/description.md": `# Install Terminal Distributor Box.

Snap the terminal distributor box (#) (1 or 2?) onto the DIN rail`,

"boxes/box1/step5/substep10/description.md": `# Validation

✔ All devices firmly mounted.
✔ Proper alignment. 
✔ No loose components.`,

"boxes/box1/step6/substep1/description.md": `# Selector Switch - Circuit Breaker 32A

For each wire of the cutter, attach a wire ferrule (#):
1. Cut 340 mm of 2.5mm² red wire (#) to connect the Selector Switch (#) With the Circuit Breaker 32A (#).
2. Cut 340 mm of 2.5mm² blue wire to connect the Selector Switch with the Circuit Breaker 32A.`,

"boxes/box1/step6/substep2/description.md": `# Circuit Breaker 32A – Green light indicator

For each wire of the cutter, attach a wire ferrule (#):
1. Cut 90 mm of 1.5mm² red wire (#) to connect the Circuit Breaker 32A (#) with the Green
Indicator Light (#).
2. Cut 120 mm of 1.5mm² blue wire (#) to connect the Circuit Breaker 32A with the Green Indicator Light.`,

"boxes/box1/step6/substep3/description.md": `# Circuit Breaker 32A – Contactor

For each wire of the cutter, attach a wire ferrule (#):
1. Cut 430 mm of 2.5mm² red wire (#) to connect the Circuit Breaker 32A (#) (Output) with
terminal 1L1 of the contactor (#).
2. Cut 430 mm of 2.5mm² blue wire (#) to connect the Circuit Breaker 32A (Output) with
terminal 3L2 of the contactor.`,

"boxes/box1/step6/substep4/description.md": `# Circuit Breakers 16A – Contactor

For each wire of the cutter, attach a wire ferrule (#):
1. Cut 420 mm of 1.5mm² red wire (#) to connect terminal 1L2 of the contactor (#) With the 7th Circuit Breaker (#) (you mean circuit breaker 16A, right?)
2. Cut 420 mm of 1.5mm² blue wire (#) to connect terminal 3L2 of the contactor with the
7th Circuit Breaker
3. Cut 430 mm of 1.5mm² blue wire to connect the 7th Circuit Breaker (Output) With terminal A2 of the contactor.`,

"boxes/box1/step6/substep5/description.md": `# Circuit Breakers 16A – Emergency Stop

For each wire of the cutter, attach a wire ferrule (#):
1. Cut 1250 mm of 1.5mm² red wire (#) to connect the 7th Circuit Breaker (#) (Output) With the Emergency Stop (#)`,

"boxes/box1/step6/substep6/description.md": `# Emergency Stop – Start push button
For each wire of the cutter, attach a wire ferrule (#).
1. Cut 180 mm of 1.5mm² red wire (#) to connect the Emergency Stop (#) with the Start Push Button (#).`,

"boxes/box1/step6/substep7/description.md": `# Start – Stop push buttons
For each wire of the cutter, attach a wire ferrule (#)
-Cut 280 mm of 1.5mm² red wire (#) to connect the Stop Push Button (#) With terminal NO3 of the Start Push Button (#).`,

"boxes/box1/step6/substep8/description.md": `#  Start push button – Contactor
For each wire of the cutter, attach a wire ferrule (#).
-Cut 1500mm of 1.5mm² red wire (#) to connect terminal NO3 of the Start Push Button (#) with terminal 13NO of the contactor (#).
-Cut 1350 mm of 1.5mm² red wire to connect terminal 4 of the Start Push Button with terminal A1 of the contactor.
-Cut 1200 mm of 1.5mm² red wire to connect terminal 4 of the Start Push Button with terminal 14 NO of the contactor.`,

"boxes/box1/step6/substep9/description.md": `# Contactor – Green light indicator
For each wire of the cutter, attach a wire ferrule (#).
-Cut 1150 mm of 1.5mm² red wire (#) to connect terminal 14NO of the contactor (#) with the green light Indicator (#).
-Cut 1150 mm of 1.5mm² blue wire (#) to connect the green light Indicator with terminal 4T2 of the contactor.`,

"boxes/box1/step6/substep10/description.md": ` # Contactor – Terminal distributor box (1 or 2 ?)
For each wire of the cutter, attach a wire ferrule (#).
-Cut 200 mm of 2.5 mm² red wire (#) to connect terminal 2T1 of the contactor (#) with the Terminal distributor box (#).
-Cut 200 mm of 2.5 mm² blue wire (#) to connect terminal 4T2 of the contactor with the Terminal distributor box.`,

"boxes/box1/step6/substep11/description.md": `# Validation`,

"boxes/box1/step7/substep1/description.md": `# Mount Servo Drives

1. Position each servo drive onto mounting plate.
2. Secure using M4 screws.
3. Tighten carefully without damaging threads.

Repeat for all 6 servo drives.`,

"boxes/box1/step7/substep2/description.md": `# Validation`,

"boxes/box1/step8/substep1/description.md": `# Distributor box - Circuit Breakers 16A

For each wire of the cutter, attach a wire ferrule (#)
-Cut 280 mm of 1.5mm² red wire (#) to connect the Terminal distributor box (#) with the 1st Circuit Breaker (#) (instead of Circuit Break_1 , ok ?)
-Cut 280 mm of 1.5mm² blue wire (#) to connect the Terminal distributor box with the 1st Circuit Breaker
-Cut 300 mm of 1.5mm² red wire to connect the Terminal distributor box with the 2nd Circuit Breaker (#)
-Cut 300 mm of 1.5mm² blue wire to connect the Terminal distributor box with the 2nd Circuit Breaker
-Cut 315 mm of 1.5mm² red wire to connect the Terminal distributor box with the 3rd Circuit Breaker (#)
-Cut 315 mm of 1.5mm² blue wire to connect the Terminal distributor box with the 3rd Circuit Breaker
-Cut 330 mm of 1.5mm² red wire to connect the Terminal distributor box with the 4th Circuit Breaker (#)
-Cut 330 mm of 1.5mm² blue wire to connect the Terminal distributor box with the 4th Circuit Breaker
-Cut 345 mm of 1.5mm² red wire to connect the Terminal distributor box with the 5th Circuit Breaker (#)
-Cut 345 mm of 1.5mm² blue wire to connect the Terminal distributor box with the 5th Circuit Breaker
-Cut 360 mm of 1.5mm² red wire to connect the Terminal distributor box with the 6th Circuit Breaker (#)
-Cut 360 mm of 1.5mm² blue wire to connect the Terminal distributor box with the 6th Circuit Breaker`,

"boxes/box1/step8/substep2/description.md": `# Circuit Breakers 16A – Servo Drives

For each wire of the cutter, attach a wire ferrule (#)
-Cut 1150 mm of 1.5mm² red wire to connect the 1st Circuit Breaker (#) with terminal L1 of the 1st Servo Drive
-Cut 1150 mm of 1.5mm² blue wire to connect the 1st Circuit Breaker with terminal L2 of the 1st Servo Drive
-Cut 1220 mm of 1.5mm² red wire to connect the 2nd Circuit Breaker (#) with terminal L1 of the 2nd Servo Drive
-Cut 1220 mm of 1.5mm² blue wire to connect the 2nd Circuit Breaker with terminal L2 of the 2nd Servo Drive
-Cut 1290 mm of 1.5mm² red wire to connect the 3rd Circuit Breaker (#) with terminal L1 of the 3rd Servo Drive
-Cut 1290 mm of 1.5mm² blue wire to connect the 3rd Circuit Breaker with terminal L2 of the 3rd Servo Drive
-Cut 1360 mm of 1.5mm² red wire to connect the 4th Circuit Breaker (#) with terminal L1 of the 4th Servo Drive
-Cut 1360 mm of 1.5mm² blue wire to connect the 4th Circuit Breaker with terminal L2 of the 4th Servo Drive
-Cut 1430 mm of 1.5mm² red wire to connect the 5th Circuit Breaker (#) with terminal L1 of the 5th Servo Drive
-Cut 1430 mm of 1.5mm² blue wire to connect the 5th Circuit Breaker with terminal L2 of the 5th Servo Drive
-Cut 1500 mm of 1.5mm² red wire to connect the 6th Circuit Breaker (#) with terminal L1 of the 6th Servo Drive
-Cut 1500 mm of 1.5mm² blue wire to connect the 6th Circuit Breaker with terminal L2 of the 6th Servo Drive`,

"boxes/box1/step8/substep3/description.md": `# Validation`,

"boxes/box1/step9/substep1/description.md": `# Mount Ground Bar

1. Position ground bar at designated location.
2. Secure using screws, washers, and nuts.
3. Tighten firmly to ensure low-resistance earth connection.`,
"boxes/box1/step9/substep2/description.md": `# Validation`,
"boxes/box1/step10/substep1/description.md": `# Install Fan 1 (Intake):

Fan 1 (#) pulls fresh air into the cabinet.
1. Position the fan on the top-right side of the cabinet (inside the cabinet?).
2. Ensure the arrow on the fan points inward, indicating air intake.
3. Secure the fan using screws (#).`,

"boxes/box1/step10/substep2/description.md": `# Install Fan 2 (Exhaust):
Fan 2 (#) pushes hot air out of the cabinet.
1. Position the fan on the bottom-left side of the cabinet (inside the cabinet?).
2. Ensure the arrow on the fan points outward, indicating air exhaust.
3. Secure the fan using screws (#).`,
"boxes/box1/step10/substep3/description.md": `# Mount Fan Filters
-Attach the filters (#) to the fans (outside the cabinet) and ensure they fit securely.`,

"boxes/box1/step10/substep4/description.md": `# Validation`,

"boxes/box1/step11/substep1/description.md": `# Mount Din Rail Sockets
-Mount the din rail sockets 1 (#) and 2 (#) (refer to the photo)`,

"boxes/box1/step11/substep2/description.md": `# Validation`,

"boxes/box1/step12/substep1/description.md": `# Mount Fuse Holder
-Mount the Fuse holder (#) on the din rail (refer to the photo)`,

"boxes/box1/step12/substep2/description.md": `# Cable Fuse Holder
For each wire of the cutter, attach a wire ferrule (#)
-Cut 430 mm of 1.5 mm² red wire (#) to connect the Terminal distributor box (1 or 2??) (#) with the Fuse holder (repeat 4 times to get 4 wires)
-Cut 130mm of 1.5mm² red wire to connect the Fuse holder with the Din rail socket 1 (#)
-Cut 350mm of 1.5 mm² blue wire (#) to connect the Din rail socket (1 or 2??) with the Terminal distributor box (1 or 2??) (#)
-Cut 1250 mm of 1.5mm² yellow wire (#) to connect the Din rail socket1 with the Ground Bar (#)
-Cut … mm of 1.5mm² red wire to connect the Fuse holder with the Din rail socket2 (#)
-Cut … mm of 1.5 mm² blue wire to connect the Din rail socket with the Terminal distributor box (1 or 2 ?) (#)
-Cut 950mm of 1.5mm² yellow wire to connect the Din rail socket2 with the Ground Bar`,

"boxes/box1/step13/substep1/description.md": `# Mount Power Supply Unit

1. Snap power supply onto DIN rail.
2. Ensure stable positioning.`,

"boxes/box1/step13/substep2/description.md": `# Cable Power Supply Unit

1. Cut 900mm of 1.5mm² red Wire. Connect fuse holder to V+.
2. Cut 630mm of 1.5mm² blue Wire. Connect V- to distributor.
3. Cut1200mm of 1.5mm² yellow wire. Connect PE to ground bar.`,

"boxes/box1/step13/substep3/description.md": `# Validation `,

"boxes/box1/step14/substep1/description.md": `# Mount Terminal Block
Snap the Terminal Block (#) correctly onto the rail (refer to photo).`,


"boxes/box1/step14/substep2/description.md": `# Cable power of motor (U,V,W,PE) (can we change the name? It’s very unclear)

For each wire of the cutter, attach a wire ferrule (#)
-Cut 3 black wires 1 mm² (#) with a length of 850 mm to connect terminal U,V,W of the 1st Servo drive (#) with the Terminal Block (#)
-Cut 850mm of 1 mm² yellow wire (#) to connect terminal PE of the 1st Servo drive with the Terminal Block 
-Cut 3 black wires 1 mm² with a length of 800 mm to connect terminal U,V,W of the 2nd Servo drive (#) with the Terminal Block
-Cut 800mm of 1 mm² yellow wire to connect terminal PE of the 2nd Servo drive with the Terminal Block 
-Cut 3 black wires 1 mm² with a length of 750 mm to connect terminal U,V,W of the 3rd Servo drive (#) with the Terminal Block
-Cut 750mm of 1 mm² yellow wire to connect terminal PE of the 3rd Servo drive with the Terminal Block 
-Cut 3 black wires 1 mm² with a length of 700 mm to connect terminal U,V,W of the 4th Servo drive (#) with the Terminal Block
-Cut 700mm of 1 mm² yellow wire to connect terminal PE of the 4th Servo drive with the Terminal Block 
-Cut 3 black wires 1 mm² with a length of 650 mm to connect terminal U,V,W of the 5th Servo drive (#) with the Terminal Block
-Cut 650mm of 1 mm² yellow wire to connect terminal PE of the 5th Servo drive with the Terminal Block 
-Cut 3 black wires 1 mm² with a length of 600 mm to connect terminal U,V,W of the 6th Servo drive (#) with the Terminal Block
-Cut 600mm of 1 mm² yellow wire to connect terminal PE of the 6th Servo drive with the Terminal Block`,

"boxes/box1/step14/substep3/description.md": `# Validation`,
"boxes/box1/step15/description.md": `#Install relay`,

"boxes/box1/step16/substep1/description.md": `# Power Supply - Relays

Use twin-wire ferrules (#) for all connections.
-Cut 920mm of 1 mm² red wire (#) to connect terminal V+ of the Power supply (#) with terminal 7NO of the Relay number 1 (#)
-Cut 90mm of 1 mm² red wire to connect terminal 7NO of the Relay number 1 with terminal 7NO of the Relay number 2 (#)
-Cut 90mm of 1 mm² red wire to connect terminal 7NO of the Relay number 2 with terminal 7NO of the Relay number 3 (#)
-Cut 90mm of 1 mm² red wire to connect terminal 7NO of the Relay number 3 with terminal 7NO of the Relay number 4 (#)
-Cut 90mm of 1 mm² red wire to connect terminal 7NO of the Relay number 4 with terminal 7NO of the Relay number 5 (#)
-Cut 90mm of 1 mm² red wire to connect terminal 7NO of the Relay number 5 with terminal 7NO of the Relay number 6 (#)`,

"boxes/box1/step16/substep2/description.md": `# Connect Relay Coils 
Use twin-wire ferrules (#) for all connections.
-Cut 500mm of 1 mm² red wire (#) to connect terminal 7NO of the Relay number 6 (#) with terminal Coil_A1 of the Relay number 6
-Cut 90mm of 1 mm² red wire to connect terminal Coil_A1 of the Relay number 6 with terminal Coil_A1 of the Relay number 5 (#)
-Cut 90mm of 1 mm² red wire to connect terminal Coil_A1 of the Relay number 5 with terminal Coil_A1 of the Relay number 4 (#)
-Cut 90mm of 1 mm² red wire to connect terminal Coil_A1 of the Relay number 4 with terminal Coil_A1 of the Relay number 3 (#)
-Cut 90mm of 1 mm² red wire to connect terminal Coil_A1 of the Relay number 3 with terminal Coil_A1 of the Relay number 2 (#)
-Cut 90mm of 1 mm² red wire to connect terminal Coil_A1 of the Relay number 2 with terminal Coil_A1 of the Relay number 1 (#)`,

"boxes/box1/step16/substep3/description.md": `# Relay Coils – Terminal Block
Use twin-wire ferrules (#) for all connections.
-Cut 450mm of 1 mm² red wire (#) to connect terminal Coil_A2 of the Relay number 1 (#) with Terminal Block (#) (break+_servo1) is this like a port? Or a component? Brake?
-Cut 430mm of 1 mm² red wire to connect terminal Coil_A2 of the Relay number 2 with Terminal Block (break+_servo2)
-Cut 410mm of 1 mm² red wire to connect terminal Coil_A2 of the Relay number 3 with Terminal Block (break+_servo3)
-Cut 390mm of 1 mm² red wire to connect terminal Coil_A2 of the Relay number 4 with Terminal Block (break+_servo4)
-Cut 370mm of 1 mm² red wire to connect terminal Coil_A2 of the Relay number 5 with Terminal Block (break+_servo5)
-Cut 350mm of 1 mm² red wire to connect terminal Coil_A2 of the Relay number 6 with Terminal Block (break+_servo6)`,

"boxes/box1/step16/substep4/description.md": `# Relay COM – Terminal Block
Use twin-wire ferrules (#) for all connections.
-Cut 400mm of 1 mm² red wire (#) to connect terminal COM11 of the Relay (#) number 1 with Terminal Block (#) (break+_motor1) 
-Cut 375mm of 1 mm² red wire to connect terminal COM11 of the Relay number 2 with Terminal Block (break+_motor2)
-Cut 350mm of 1 mm² red wire to connect terminal COM11 of the Relay number 3 with Terminal Block (break+_motor3)
-Cut 325mm of 1 mm² red wire to connect terminal COM11 of the Relay number 4 with Terminal Block (break+_motor4)
-Cut 300mm of 1 mm² red wire to connect terminal COM11 of the Relay number 5 with Terminal Block (break+_motor5)
-Cut 350mm of 1 mm² red wire to connect terminal COM11 of the Relay number 6 with Terminal Block (break+_motor6)`,

"boxes/box1/step16/substep5/description.md": `# Connect Negative Lines
Use twin-wire ferrules (#) for all connections.
-Cut 620mm of 1mm² blue wire (#) to connect terminal V- of the Power Supply with Terminal Block (#) (OU_break-_servo1)
-Cut 50mm of 1mm² blue wire to connect Terminal Block (OU_break-_servo1) with Terminal Block (OU_break-_servo2) 
-Cut 50mm of 1mm² blue wire to connect Terminal Block (OU_break-_servo2) with Terminal Block (OU_break-_servo3)
-Cut 50mm of 1mm² blue wire to connect Terminal Block (OU_break-_servo3) with Terminal Block (OU_break-_servo4)
-Cut 50mm of 1mm² blue wire to connect Terminal Block (OU_break-_servo4) with Terminal Block (OU_break-_servo5)
-Cut 50mm of 1mm² blue wire to connect Terminal Block (OU_break-_servo5) with Terminal Block (OU_break-_servo6)`,

"boxes/box1/step16/substep6/description.md": `# Motor Brake Final Connection (CN1)
Use twin-wire ferrules (#) for all connections.
-Cut 850mm of 0.5mm² blue wire (#) to connect terminal 4 of the CN1_Servo1 (#) with Terminal Block (#) (IN_break-_servo1)
-Cut 810mm of 0.5mm² blue wire to connect terminal 4 of the CN1_Servo2 (#) with Terminal Block (IN_break-_servo2)
-Cut 770mm of 0.5mm² blue wire to connect terminal 4 of the CN1_Servo3 (#) with Terminal Block (IN_break-_servo3)
-Cut 730mm of 0.5mm² blue wire to connect terminal 4 of the CN1_Servo4 (#) with Terminal Block (IN_break-_servo4)
-Cut 690mm of 0.5mm² blue wire to connect terminal 4 of the CN1_Servo5 (#) with Terminal Block (IN_break-_servo5)
-Cut 650mm of 0.5mm² blue wire to connect terminal 4 of the CN1_Servo6 (#) with Terminal Block (IN_break-_servo6)

-Cut 880mm of 0.5mm² red wire (#) to connect terminal 5 of the CN1_Servo1 with Terminal Block (IN_break+_servo1)
-Cut 840mm of 0.5mm² red wire to connect terminal 5 of the CN1_Servo2 with Terminal Block (IN_break-_servo2)
-Cut 800mm of 0.5mm² red wire to connect terminal 5 of the CN1_Servo3 with Terminal Block (IN_break-_servo3)
-Cut 760mm of 0.5mm² red wire to connect terminal 5 of the CN1_Servo4 with Terminal Block (IN_break-_servo4)
-Cut 720mm of 0.5mm² red wire to connect terminal 5 of the CN1_Servo5 with Terminal Block (IN_break-_servo5)
-Cut 680mm of 0.5mm² red wire to connect terminal 5 of the CN1_Servo6 with Terminal Block (IN_break-_servo6)`,

"boxes/box1/step16/substep7/description.md": `# Validation`,

"boxes/box1/step17/description.md": `#This whole step is confusing, needs revisitation, and there is no mention of PG16 and PG29 ? This step is called “Fix Connector Harting_32B and Cable_gland (PG16 and
PG29)” in the original document.`,

"boxes/box1/step17/substep1/description.md": `# Mount Harting Connector
-Place the Harting 32B housing (#) into the cut-out.
-Secure the connector using 4 M4 screws (#) and 4 M4 lock nuts (#).`,

"boxes/box1/step17/substep2/description.md": `# Install Cable Glands
-Insert the cable gland (#) through the hole from the outside of the enclosure.
-Tighten the locknut (#) from the inside of the enclosure.
-Pass the cable (#) through the gland. (What cable? We didn't mention any cable)
-Tighten the gland nut to clamp the cable and provide strain relief.`,

"boxes/box1/step17/substep3/description.md": `# Validation`,


"boxes/box1/step18/substep1/description.md": `# Terminal block – Harting Connector

What kind of ferrule?
-Cut 18 black wires 1 mm² (#) with a length of 300 mm to connect terminal U,V,W of the Terminal Block (#) with the Harting_32B (#).
-Cut 6 Yellow wires 1 mm² with a length of 300 mm to connect terminal PE of the Terminal Block with the Harting_32B .
-Cut 6 Red wires 1 mm² with a length of 250 mm to connect terminal Break+ of the Terminal Block with the Harting_32B.
-Cut 2 blue wires 1 mm² with a length of 280 mm to connect terminal Break- of the Terminal Block with the Harting_32B.`, 
"boxes/box1/step18/substep2/description.md": `# Validation`,

"boxes/box1/step19/substep1/description.md": `# Mount Aviation Plug
You mean 6 aviation plugs? 12? or just 1? 
-Insert the GX16 aviation connector (#) through the hole from the outside of the plastic enclosure. (On the cabinet door?)
-From the inside, fix the nut (#) using a wrench (#). Do not overtighten to avoid damaging the plastic enclosure.`,

"boxes/box1/step19/substep2/description.md": `# Validation`,

"boxes/box1/step20/substep1/description.md": `# Cable Servo Outputs
For each wire of the cutter, attach a wire ferrule (#) (is this true? Or twin ferrules?)
-Cut 1000mm of 0.5mm² blue wire (#) to connect terminal 6 of the CN1_servo1 (you mean terminal 6 – CN1 of the servo drive 1?) (#) with terminal 1 of the Aviation plug_GX16 (#) (Output1_servo1)
-Cut 1000mm of 0.5mm² blue wire to connect terminal 2 of the CN1_servo1 with terminal 2 of the Aviation plug_GX16 (Output2_servo1)
-Cut 1140mm of 0.5mm² blue wire to connect terminal 6 of the CN1_servo2 (#) with terminal 1 of the Aviation plug_GX16 (Output1_servo2)
-Cut 1140mm of 0.5mm² blue wire to connect terminal 2 of the CN1_servo2 with terminal 2 of the Aviation plug_GX16 (Output2_servo2)
-Cut 1280mm of 0.5mm² blue wire to connect terminal 6 of the CN1_servo3 (#) with terminal 1 of the Aviation plug_GX16 (Output1_servo3)
-Cut 1280mm of 0.5mm² blue wire to connect terminal 2 of the CN1_servo3 with terminal 2 of the Aviation plug_GX16 (Output2_servo3)
-Cut 1420mm of 0.5mm² blue wire to connect terminal 6 of the CN1_servo4 (#) with terminal 1 of the Aviation plug_GX16 (Output1_servo4)
-Cut 1420mm of 0.5mm² blue wire to connect terminal 2 of the CN1_servo4 with terminal 2 of the Aviation plug_GX16 (Output2_servo4)
-Cut 1560mm of 0.5mm² blue wire to connect terminal 6 of the CN1_servo5 (#) with terminal 1 of the Aviation plug_GX16 (Output1_servo5)
-Cut 1560mm of 0.5mm² blue wire to connect terminal 2 of the CN1_servo5 with terminal 2 of the Aviation plug_GX16 (Output2_servo5)
-Cut 1700mm of 0.5mm² blue wire to connect terminal 2 of the CN1_servo6 (#) with terminal 1 of the Aviation plug_GX16 (Output1_servo6)
-Cut 1700mm of 0.5mm² blue wire to connect terminal 2 of the CN1_servo6 with terminal 2 of the Aviation plug_GX16 (Output2_servo6)`,

"boxes/box1/step20/substep2/description.md": `# Cable Servo Inputs
For each wire of the cutter, attach a wire ferrule (#) (is this true? Or twin ferrule?)
-Cut 1050mm of 0.5mm² blue wire (#) to connect terminal 10 of the CN1_servo1 with terminal 1 of the Aviation plug_GX16 (Input1_servo1)
-Cut 1050mm of 0.5mm² blue wire to connect terminal 9 of the CN1_servo1 with terminal 2 of the Aviation plug_GX16 (Input2_servo1)
-Cut 1190mm of 0.5mm² blue wire to connect terminal 10 of the CN1_servo2 with terminal 1 of the Aviation plug_GX16 (Input1_servo2)
-Cut 1190mm of 0.5mm² blue wire to connect terminal 9 of the CN1_servo2 with terminal 2 of the Aviation plug_GX16 (Input2_servo2)
-Cut 1330mm of 0.5mm² blue wire to connect terminal 10 of the CN1_servo3 with terminal 1 of the Aviation plug_GX16 (Input1_servo3)
-Cut 1330mm of 0.5mm² blue wire to connect terminal 9 of the CN1_servo3 with terminal 2 of the Aviation plug_GX16 (Input2_servo3)
-Cut 1470mm of 0.5mm² blue wire to connect terminal 10 of the CN1_servo4 with terminal 1 of the Aviation plug_GX16 (Input1_servo4)
-Cut 1470mm of 0.5mm² blue wire to connect terminal 9 of the CN1_servo4 with terminal 2 of the Aviation plug_GX16 (Input2_servo4)
-Cut 1610mm of 0.5mm² blue wire to connect terminal 10 of the CN1_servo5 with terminal 1 of the Aviation plug_GX16 (Input1_servo5)
-Cut 1610mm of 0.5mm² blue wire to connect terminal 9 of the CN1_servo5 with terminal 2 of the Aviation plug_GX16 (Input2_servo5)
-Cut 1750mm of 0.5mm² blue wire to connect terminal 10 of the CN1_servo6 with terminal 1 of the Aviation plug_GX16 (Input1_servo6)
-Cut 1750mm of 0.5mm² blue wire to connect terminal 9 of the CN1_servo6 with terminal 2 of the Aviation plug_GX16 (Input2_servo6)`,

"boxes/box1/step20/substep3/description.md": `# Cable Servo Digital Outputs (is this correct? Can we call these digital outputs? Knowing that substep1 : outputs.)
For each wire of the cutter, attach a wire ferrule (#) (is this true? Or twin ferrule?)
-Cut 3 Red wires 0.5 mm² (#) with a length of 650 mm to connect terminal (1,3,13) of the CN1_servo1 (#) with the Terminal distributor box_2 (#) (DO2+,DO1+ and COM+)
-Cut 3 Red wires 0.5 mm² with a length of 600 mm to connect terminal (1,3,13) of the CN1_servo2 (#) with the Terminal distributor box_2 (DO2+,DO1+ and COM+)
-Cut 3 Red wires 0.5 mm² with a length of 550 mm to connect terminal (1,3,13) of the CN1_servo3 (#) with the Terminal distributor box_2 (DO2+,DO1+ and COM+)
-Cut 3 Red wires 0.5 mm² with a length of 500 mm to connect terminal (1,3,13) of the CN1_servo4 (#) with the Terminal distributor box_2 (DO2+,DO1+ and COM+)
-Cut 3 Red wires 0.5 mm² with a length of 550 mm to connect terminal (1,3,13) of the CN1_servo5 (#) with the Terminal distributor box_2 (DO2+,DO1+ and COM+)
-Cut 3 Red wires 0.5 mm² with a length of 600 mm to connect terminal (1,3,13) of the CN1_servo6 (#) with the Terminal distributor box_2 (DO2+,DO1+ and COM+).`,

"boxes/box1/step20/substep4/description.md": `# Cable PE / Ground
For each wire of the cutter, attach a wire ferrule (#) (is this true? Or twin ferrule?)
-Cut 7 Yellow wires 1 mm² (#) with a length of 400 mm to connect the Terminal Block_PE (#) with the Ground Bar (#)
-Cut 100mm of 0.5mm² Yellow wire (#) to connect the mounting plate (#) with Terminal Block_PE (#)
-Cut 650mm of 0.5mm² Yellow wire to connect terminal PE of the servo1 (#) with Terminal Block_PE
-Cut 600mm of 0.5mm² Yellow wire to connect terminal PE of the servo2 (#) with Terminal Block_PE
-Cut 550mm of 0.5mm² Yellow wire to connect terminal PE of the servo3 (#) with Terminal Block_PE
-Cut 500mm of 0.5mm² Yellow wire to connect terminal PE of the servo4 (#) with Terminal Block_PE
-Cut 450mm of 0.5mm² Yellow wire to connect terminal PE of the servo5 (#) with Terminal Block_PE
-Cut 400mm of 0.5mm² Yellow wire to connect terminal PE of the servo6 (#) with Terminal Block_PE.`, 

"boxes/box1/step20/substep5/description.md": `# Solder Cables
For each servo: (here we should mention that these are provided in the box already soldered.
PLUS two extra ones that are not soldered for the user to try soldering by themselves.
if they fail, they have the correctly soldered cables already, right?)
-Solder cable DO1- (#) to pin 1 of the GX16 connector (#).
-Solder cable DO2- (#) to pin 1 of the GX16 connector.
-Solder cable DI1 (#) to pin 1 of the GX16 connector.
-Solder cable DI2 (#) to pin 1 of the GX16 connector.`,

"boxes/box1/step20/substep6/description.md": `# Cable Motors (this step needs revisiting)
-Cable (U, V, W, PE, Br+, Br-) of motor (#) with the Harting 32B connector (#) (what motor? The actual motors? That are in the robot?? Or are talking about motor wires here?)
-Cable Encoder of motor (#) with connector CN2 of servo_drive (#)
(encoder of motor? Is this a component ? We didn’t install it or mention it before.)
(which servo drive?)
(“cable” ? You mean with the cables we soldered? This should be more detailed, it's unclear what to use for the cabling.).`,

"boxes/box1/step20/substep7/description.md": `# Final System Validation

✔ All mechanical components secured  
✔ All electrical connections tightened  
✔ Proper grounding verified  
✔ No exposed conductors  
✔ Cabinet door closes properly

The electrical cabinet assembly is complete.`,
};

for (const [relativePath, content] of Object.entries(contentMap)) {
  const fullPath = path.join(ROOT, relativePath);
  const dir = path.dirname(fullPath);
  mkdirSync(dir, { recursive: true });
  writeFileSync(fullPath, content, "utf-8");
  console.log("✅ Written:", relativePath);
}

console.log("\n🎉 All content files created successfully.");