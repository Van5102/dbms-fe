import { useRef, useState } from "react";
import { ShakeOutlined } from "@ant-design/icons"
import {
  Row, Col, Button
} from 'antd'

const DrawCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const context = canvas.getContext("2d");
    context.beginPath();
    context.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  }

  const draw = (e) => {
    if (isDrawing) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const context = canvas.getContext("2d");
      context.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      context.stroke();
    }
  }

  const endDrawing = () => {
    setIsDrawing(false);
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  return (
    <Row gutter={[8, 8]}>
      <Col>
        <Button type="primary" 
          onClick={clearCanvas}
          icon={<ShakeOutlined />}
        >
          Xóa
        </Button>
      </Col>

      <Col>
        <canvas
          ref={canvasRef}
          width={200}
          height={100}
          style={{ border: "1px solid #000000" }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
        />
      </Col>
    </Row>
  );
}

export default DrawCanvas;
