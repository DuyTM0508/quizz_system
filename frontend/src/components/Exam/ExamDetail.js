import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import { Container, Card, Button, Form, ListGroup } from 'react-bootstrap';

const API_URL = 'http://localhost:9999';

const ExamDetail = () => {
  const { id } = useParams(); // examId
  const [exam, setExam] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: ''
  });

  useEffect(() => {
    fetchExam();
  }, []);

  const fetchExam = async () => {
    try {
      const res = await axios.get(`${API_URL}/exams/${id}`);
      setExam(res.data.DT || res.data);
    } catch (err) {
      console.error('Error fetching exam:', err);
    }
  };

  const handleOptionChange = (value, index) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleAddQuestion = async () => {
    try {
      const payload = {
        examId: id,
        questionText: newQuestion.questionText,
        options: newQuestion.options,
        correctAnswer: newQuestion.correctAnswer
      };

      console.log('Payload:', payload);

      const res = await axios.post(`${API_URL}/exams/add-question`, payload);
      setExam(res.data.DT || res.data);
      toast.success("Exam updated successfully");

      // Reset form
      setNewQuestion({
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: ''
      });
    } catch (err) {
      console.error('Error creating question:', err);
      toast.error("Exam updated successfully");
    }
  };
  const handleDeleteQuestion = async (questionText) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?");
    if (!confirmDelete) return;
  
    try {
      const res = await axios.delete(
        `${API_URL}/exams/${id}/delete-question/${encodeURIComponent(questionText)}`
      );
      setExam(res.data.DT || res.data);
      toast.success("Question deleted!");
    } catch (err) {
      console.error("Error deleting question:", err);
      toast.error("Failed to delete question");
    }
  };
  
  

  return (
    <Container className="mt-4">
      <h2 className="text-primary">Exam Detail</h2>
      {exam && (
        <Card className="mb-4 shadow-sm p-3">
          <h4>{exam.title}</h4>
          <p><strong>Category:</strong> {exam.category}</p>
          <p><strong>Description:</strong> {exam.description}</p>
          <p><strong>Duration:</strong> {exam.duration} minutes</p>
        </Card>
      )}

      <Card className="p-3 mb-4">
        <h5 className="mb-3">Add New Question</h5>
        <Form.Group className="mb-3">
          <Form.Label>Question</Form.Label>
          <Form.Control
            type="text"
            value={newQuestion.questionText}
            onChange={e => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
          />
        </Form.Group>
        {newQuestion.options.map((opt, idx) => (
          <Form.Group className="mb-2" key={idx}>
            <Form.Label>Option {idx + 1}</Form.Label>
            <Form.Control
              type="text"
              value={opt}
              onChange={e => handleOptionChange(e.target.value, idx)}
            />
          </Form.Group>
        ))}
        <Form.Group className="mb-3">
          <Form.Label>Correct Answer</Form.Label>
          <Form.Control
            type="text"
            value={newQuestion.correctAnswer}
            onChange={e => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
          />
        </Form.Group>
        <Button onClick={handleAddQuestion} variant="success">Add Question</Button>
      </Card>

      <Card className="p-3">
        <h5>Questions</h5>
        <ListGroup>
          {(!exam?.questions || exam.questions.length === 0) && (
            <div className="text-muted">No questions added yet.</div>
          )}
          {exam?.questions?.map((q, idx) => (
            <ListGroup.Item key={idx}>
            <div className="d-flex justify-content-between">
              <div>
                <strong>Q{idx + 1}:</strong> {q.questionText}
                <ul>
                  {q.options.map((opt, i) => (
                    <li key={i} style={{ color: opt === q.correctAnswer ? 'green' : 'inherit' }}>
                      {opt}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteQuestion(q.questionText)}
              >
                Delete
              </Button>
            </div>
          </ListGroup.Item>
          
          ))}
        </ListGroup>
      </Card>
    </Container>
  );
};

export default ExamDetail;
