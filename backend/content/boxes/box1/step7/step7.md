# MODULE 3: Servo Drives & Communication

---

## 1. Servo-drive EL7-EC400N (x6)

### Definition
The **EL7-EC400N** is a 400W AC servo drive manufactured by Leadshine, designed for high-precision motion control in industrial automation.  
It belongs to the EL7 series and uses advanced digital signal processing for precise **position, speed, and torque control**.

### Reasons for Choosing Leadshine EL7-EC400N
- Precise control of each servomotor  
- Smooth and synchronized motion  
- Real-time error correction  
- Efficient management of motor electrical power  
- Industrial recognition and reliability  
- Advanced control via **EtherCAT**  

---

## 2. EtherCAT Communication

**EtherCAT (Ethernet for Control Automation Technology)** is a real-time communication protocol used for industrial controllers and robots.  

- The six EL7-EC400N drives are connected in a **chain via EtherCAT**.  
- Each drive:  
  - Receives position/speed commands  
  - Adjusts the motor in closed loop using its encoder  
  - Sends its status back to the master controller  
- This ensures **synchronization of all robot axes in real time with high precision**.  

---

## 3. Encoder Feedback

- An **encoder** is a rotary position sensor that measures the position and rotational speed of the motor shaft.  
- Provides precise feedback on motor position and speed.  
- Enables the servo drive to instantly correct deviations from the command.  
- Closed-loop feedback ensures **accurate and reliable motor control**, even for **multi-axis robots** or complex industrial systems.  
