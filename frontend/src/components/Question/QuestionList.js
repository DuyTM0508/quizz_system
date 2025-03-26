import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Button,
  Form,
  InputGroup,
  Card,
  Pagination,
  ButtonGroup,
  Modal,
} from "react-bootstrap";

const API_URL = "http://localhost:9999/questions";

const QuestList = () => {
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [newQuestion, setNewQuestion] = useState({
    type: "",
    text: "",
    description: "",
    category: "",
    options: [],
    correctAnswer: "",
    hidden: false,
  });
  const [editQuestion, setEditQuestion] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, []);
  const fetchQuestions = async () => {
    try {
      const response = await axios.get(API_URL);
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };
  const handleCreateQuestion = async () => {
    try {
      const response = await axios.post(API_URL, newQuestion);
      setQuestions([...questions, response.data]);
      setNewQuestion({
        type: "",
        text: "",
        description: "",
        category: "",
        options: [],
        correctAnswer: "",
        hidden: false,
      });
      setModalShow(false);
    } catch (error) {
      console.error("Error creating question:", error);
    }
  };
  const handleUpdateQuestion = async () => {
    try {
      await axios.put(`${API_URL}/${editQuestion._id}`, editQuestion);
      setQuestions(
        questions.map((q) => (q._id === editQuestion._id ? editQuestion : q))
      );
      setEditQuestion(null);
      setModalShow(false);
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setQuestions(questions.filter((q) => q._id !== id));
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };
  const toggleHide = async (id, hiddenStatus) => {
    try {
      await axios.put(`${API_URL}/${id}`, { hidden: !hiddenStatus });
      setQuestions(
        questions.map((q) => (q._id === id ? { ...q, hidden: !q.hidden } : q))
      );
    } catch (error) {
      console.error("Error toggling question visibility:", error);
    }
  };
  // Handle adding/removing options for multiple/single choice questions
  const addOption = () => {
    setNewQuestion({
      ...newQuestion,
      options: [...newQuestion.options, { text: "", isCorrect: false }],
    });
  };
  const updateOption = (index, field, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index][field] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };
  const removeOption = (index) => {
    const updatedOptions = newQuestion.options.filter((_, i) => i !== index);
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };
  const filteredQuestions = questions.filter(
    (q) =>
      (q.text.toLowerCase().includes(search.toLowerCase()) ||
        q.description.toLowerCase().includes(search.toLowerCase())) &&
      (filterType ? q.type === filterType : true) &&
      (filterCategory ? q.category === filterCategory : true)
  );
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4 bg-primary text-white p-3 rounded">
        Question Bank
      </h1>
      <InputGroup className="mb-4 rounded">
        <Form.Control
          type="text"
          placeholder="Search questions"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="single">Single Choice</option>
            <option value="multiple">Multiple Choice</option>
            <option value="true_false">True/False</option>
            <option value="short">Short Answer</option>
          </Form.Select>
        </Col>
        <Col md={6}>
          <Form.Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {[...new Set(questions.map((q) => q.category))].map(
              (category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              )
            )}
          </Form.Select>
        </Col>
      </Row>
      <div className="text-center mb-1">
        <ButtonGroup>
          <Button
            variant="primary"
            onClick={() => setModalShow(true)}
            size="sm"
          >
            Create New Question
          </Button>
        </ButtonGroup>
      </div>
      <ListGroup as="ul" className="mt-4">
        {currentQuestions.map(
          (q) =>
            !q.hidden && (
              <ListGroup.Item
                key={q._id}
                className="d-flex justify-content-between align-items-center mb-3 p-3 border rounded shadow-sm"
              >
                <Card className="w-100 border-0">
                  <Card.Body>
                    <h5 className="text-primary mb-0">{q.text}</h5>
                    <small className="text-muted d-block">{q.category}</small>
                    <p>{q.description}</p>
                    <small className="text-muted">{q.type}</small>

                    {/* Show Options for Single/Multiple Choice */}
                    {(q.type === "single" || q.type === "multiple") && (
                      <div>
                        <strong>Options:</strong>
                        <ul className="ps-3">
                          {q.options.map((option, index) => (
                            <li
                              key={index}
                              className={
                                option.isCorrect ? "text-success fw-bold" : ""
                              }
                            >
                              {option.text} {option.isCorrect && "(Correct)"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Show Correct Answer for True/False & Short */}
                    {(q.type === "true_false" || q.type === "short") && (
                      <p>
                        <strong>Correct Answer:</strong>{" "}
                        {q.correctAnswer.toString()}
                      </p>
                    )}
                  </Card.Body>
                </Card>
                <div className="d-flex align-items-center">
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => {
                      setEditQuestion(q);
                      setModalShow(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(q._id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleHide(q._id, q.hidden)}
                  >
                    {q.hidden ? "Show" : "Hide"}
                  </Button>
                </div>
              </ListGroup.Item>
            )
        )}
      </ListGroup>
      <Pagination className="mt-4">
        {[...Array(Math.ceil(filteredQuestions.length / questionsPerPage))].map(
          (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          )
        )}
      </Pagination>
      <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editQuestion ? "Edit Question" : "Create New Question"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Title */}
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editQuestion ? editQuestion.text : newQuestion.text}
                onChange={(e) =>
                  editQuestion
                    ? setEditQuestion({ ...editQuestion, text: e.target.value })
                    : setNewQuestion({ ...newQuestion, text: e.target.value })
                }
              />
            </Form.Group>

            {/* Type (Dropdown) */}
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={editQuestion ? editQuestion.type : newQuestion.type}
                onChange={(e) => {
                  const type = e.target.value;
                  if (editQuestion) {
                    setEditQuestion({
                      ...editQuestion,
                      type,
                      options: [],
                      correctAnswer: "",
                    });
                  } else {
                    setNewQuestion({
                      ...newQuestion,
                      type,
                      options: [],
                      correctAnswer: "",
                    });
                  }
                }}
              >
                <option value="">Select Question Type</option>
                <option value="single">Single Choice</option>
                <option value="multiple">Multiple Choice</option>
                <option value="true_false">True/False</option>
                <option value="short">Short Answer</option>
              </Form.Select>
            </Form.Group>

            {/* Category */}
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={
                  editQuestion ? editQuestion.category : newQuestion.category
                }
                onChange={(e) =>
                  editQuestion
                    ? setEditQuestion({
                        ...editQuestion,
                        category: e.target.value,
                      })
                    : setNewQuestion({
                        ...newQuestion,
                        category: e.target.value,
                      })
                }
              />
            </Form.Group>

            {/* Options (For Single & Multiple Choice) */}
            {(editQuestion?.type === "single" ||
              editQuestion?.type === "multiple" ||
              editQuestion?.type === "true_false" ||
              newQuestion?.type === "single" ||
              newQuestion?.type === "multiple" ||
              newQuestion?.type === "true_false") && (
              <Form.Group className="mb-3">
                <Form.Label>Options</Form.Label>
                {(editQuestion
                  ? editQuestion.options
                  : newQuestion.options
                ).map((option, index) => (
                  <InputGroup key={index} className="mb-2">
                    <Form.Control
                      type="text"
                      value={option.text}
                      onChange={(e) => {
                        const newOptions = editQuestion
                          ? [...editQuestion.options]
                          : [...newQuestion.options];
                        newOptions[index].text = e.target.value;
                        editQuestion
                          ? setEditQuestion({
                              ...editQuestion,
                              options: newOptions,
                            })
                          : setNewQuestion({
                              ...newQuestion,
                              options: newOptions,
                            });
                      }}
                    />
                    <InputGroup.Checkbox
                      checked={option.isCorrect}
                      onChange={(e) => {
                        const newOptions = editQuestion
                          ? [...editQuestion.options]
                          : [...newQuestion.options];
                        newOptions[index].isCorrect = e.target.checked;
                        editQuestion
                          ? setEditQuestion({
                              ...editQuestion,
                              options: newOptions,
                            })
                          : setNewQuestion({
                              ...newQuestion,
                              options: newOptions,
                            });
                      }}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        const newOptions = editQuestion
                          ? [...editQuestion.options]
                          : [...newQuestion.options];
                        newOptions.splice(index, 1);
                        editQuestion
                          ? setEditQuestion({
                              ...editQuestion,
                              options: newOptions,
                            })
                          : setNewQuestion({
                              ...newQuestion,
                              options: newOptions,
                            });
                      }}
                    >
                      Remove
                    </Button>
                  </InputGroup>
                ))}
                <Button
                  variant="secondary"
                  onClick={() => {
                    const newOptions = editQuestion
                      ? [
                          ...editQuestion.options,
                          { text: "", isCorrect: false },
                        ]
                      : [
                          ...newQuestion.options,
                          { text: "", isCorrect: false },
                        ];
                    editQuestion
                      ? setEditQuestion({
                          ...editQuestion,
                          options: newOptions,
                        })
                      : setNewQuestion({ ...newQuestion, options: newOptions });
                  }}
                >
                  Add Option
                </Button>
              </Form.Group>
            )}

            {/* Correct Answer (For Short Answer) */}
            {(editQuestion?.type === "short" ||
              newQuestion?.type === "short") && (
              <Form.Group className="mb-3">
                <Form.Label>Correct Answer</Form.Label>
                <Form.Control
                  type="text"
                  value={
                    editQuestion
                      ? editQuestion.correctAnswer
                      : newQuestion.correctAnswer
                  }
                  onChange={(e) =>
                    editQuestion
                      ? setEditQuestion({
                          ...editQuestion,
                          correctAnswer: e.target.value,
                        })
                      : setNewQuestion({
                          ...newQuestion,
                          correctAnswer: e.target.value,
                        })
                  }
                />
              </Form.Group>
            )}
            {/* Hidden Checkbox */}
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Hidden"
                checked={
                  editQuestion ? editQuestion.hidden : newQuestion.hidden
                }
                onChange={(e) =>
                  editQuestion
                    ? setEditQuestion({
                        ...editQuestion,
                        hidden: e.target.checked,
                      })
                    : setNewQuestion({
                        ...newQuestion,
                        hidden: e.target.checked,
                      })
                }
              />
            </Form.Group>

            <Button
              variant="primary"
              onClick={
                editQuestion ? handleUpdateQuestion : handleCreateQuestion
              }
            >
              {editQuestion ? "Update Question" : "Create Question"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default QuestList;
