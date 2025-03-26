// src/components/Exam/ExamDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axiosCustomize";
import { Card, Container, Spinner, Alert } from "react-bootstrap";

const ExamDetail = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`/exams/${id}`);
        setExam(res.DT);
      } catch (err) {
        setError("Failed to load exam detail");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header as="h5">{exam.title}</Card.Header>
        <Card.Body>
          <Card.Text>
            <strong>Description:</strong> {exam.description || "N/A"}
          </Card.Text>
          <Card.Text>
            <strong>Category:</strong> {exam.category}
          </Card.Text>
          <Card.Text>
            <strong>Duration:</strong> {exam.duration} minutes
          </Card.Text>
          <Card.Text>
            <strong>Questions:</strong> {exam.totalQuestions}
          </Card.Text>
          <Card.Text>
            <strong>Status:</strong> {exam.hidden ? "Hidden" : "Visible"}
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ExamDetail;
