import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  ListGroup,
  Button,
  Form,
  InputGroup,
  Card,
  Pagination,
  ButtonGroup,
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CreateExam from "./ExamDetail";

const API_URL = "http://localhost:9999/exams";

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const examsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await axios.get(API_URL);
      const list = Array.isArray(res.data?.DT)
        ? res.data.DT
        : Array.isArray(res.data)
        ? res.data
        : [];
      setExams(list);
    } catch (err) {
      console.error("Error fetching exams:", err);
      setExams([]);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setExams(exams.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Error deleting exam:", err);
    }
  };

  const filteredExams = exams.filter(
    (e) =>
      (e?.title?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (e?.description?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * examsPerPage;
  const indexOfFirst = indexOfLast - examsPerPage;
  const currentExams = filteredExams.slice(indexOfFirst, indexOfLast);

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4 bg-primary text-white p-3 rounded">
        Exam List
      </h1>

      <InputGroup className="mb-4 rounded">
        <Form.Control
          type="text"
          placeholder="Search exams"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>

      <div className="text-center mb-2">
        <ButtonGroup>
          <Button
            variant="primary"
            onClick={() => setModalShow(true)}
            size="sm"
          >
            Create New Exam
          </Button>
        </ButtonGroup>
      </div>

      <ListGroup className="mt-4">
        {currentExams.map(
          (e) =>
            !e.hidden && (
              <ListGroup.Item
                key={e._id}
                className="d-flex justify-content-between align-items-center mb-3 p-3 border rounded shadow-sm"
              >
                <Card className="w-100 border-0">
                  <Card.Body>
                    <h5
                      className="text-primary cursor-pointer"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/admin/exam/${e._id}`)}
                    >
                      {e.title}
                    </h5>
                    <small className="text-muted">{e.category}</small>
                    <p>{e.description}</p>
                    <small>Duration: {e.duration} minutes</small>
                  </Card.Body>
                </Card>
                <div className="d-flex align-items-center">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(e._id)}
                  >
                    Delete
                  </Button>
                </div>
              </ListGroup.Item>
            )
        )}
      </ListGroup>

      <Pagination className="mt-4">
        {[...Array(Math.ceil(filteredExams.length / examsPerPage))].map(
          (_, idx) => (
            <Pagination.Item
              key={idx + 1}
              active={idx + 1 === currentPage}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </Pagination.Item>
          )
        )}
      </Pagination>

      {/* Modal tạo mới */}
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Exam</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateExam onCreated={fetchExams} onClose={() => setModalShow(false)} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ExamList;
