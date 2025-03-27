import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  Card,
  Pagination,
  ButtonGroup,
  Modal,
  Badge,
} from "react-bootstrap";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaEye,
  FaEyeSlash,
  FaQuestionCircle,
  FaCheck,
  FaCheckSquare,
  FaRegCheckSquare,
  FaRegSquare,
  FaFont,
  FaTag,
  FaInfoCircle,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";

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
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [sortField, setSortField] = useState("text");
  const [sortDirection, setSortDirection] = useState("asc");
  const questionsPerPage = 5;

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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question?"
    );
    if (!confirmDelete) return;

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

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortQuestions = (a, b) => {
    if (sortField === "text") {
      return sortDirection === "asc"
        ? a.text.localeCompare(b.text)
        : b.text.localeCompare(a.text);
    } else if (sortField === "type") {
      return sortDirection === "asc"
        ? a.type.localeCompare(b.type)
        : b.type.localeCompare(a.type);
    } else if (sortField === "category") {
      return sortDirection === "asc"
        ? a.category.localeCompare(b.category)
        : b.category.localeCompare(a.category);
    }
    return 0;
  };

  // Get type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case "single":
        return <FaRegCheckSquare className="me-1" />;
      case "multiple":
        return <FaCheckSquare className="me-1" />;
      case "true_false":
        return <FaCheck className="me-1" />;
      case "short":
        return <FaFont className="me-1" />;
      default:
        return <FaQuestionCircle className="me-1" />;
    }
  };

  // Get type label
  const getTypeLabel = (type) => {
    switch (type) {
      case "single":
        return "Single Choice";
      case "multiple":
        return "Multiple Choice";
      case "true_false":
        return "True/False";
      case "short":
        return "Short Answer";
      default:
        return type;
    }
  };

  // Get type badge color
  const getTypeBadgeColor = (type) => {
    switch (type) {
      case "single":
        return "primary";
      case "multiple":
        return "success";
      case "true_false":
        return "warning";
      case "short":
        return "info";
      default:
        return "secondary";
    }
  };

  // Get category badge color
  const getCategoryColor = (category) => {
    const categories = [...new Set(questions.map((q) => q.category))];
    const colors = [
      "primary",
      "success",
      "danger",
      "warning",
      "info",
      "secondary",
      "dark",
      "primary",
      "success",
      "danger",
    ];

    const index = categories.indexOf(category) % colors.length;
    return colors[index];
  };

  let filteredQuestions = questions.filter(
    (q) =>
      (q.text.toLowerCase().includes(search.toLowerCase()) ||
        q.description.toLowerCase().includes(search.toLowerCase())) &&
      (filterType ? q.type === filterType : true) &&
      (filterCategory ? q.category === filterCategory : true)
  );

  filteredQuestions = filteredQuestions.sort(sortQuestions);

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container className="mt-4 mb-5">
      <div className="py-4 text-center">
        <h1 className="mb-3 position-relative d-inline-block">
          <span className="border-bottom border-primary border-3 pb-2">
            Question Bank
          </span>
        </h1>
        <p className="text-muted">
          Manage your questions, create new ones, or modify existing questions
        </p>
      </div>

      <div className="bg-light p-4 rounded shadow-sm mb-4">
        <Row className="mb-3">
          <Col md={12}>
            <InputGroup>
              <InputGroup.Text className="bg-primary text-white border-0">
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search questions by title or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="py-2"
              />
            </InputGroup>
          </Col>
        </Row>

        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <Form.Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="py-2"
            >
              <option value="">All Question Types</option>
              <option value="single">Single Choice</option>
              <option value="multiple">Multiple Choice</option>
              <option value="true_false">True/False</option>
              <option value="short">Short Answer</option>
            </Form.Select>
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <Form.Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="py-2"
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
          <Col md={4} className="d-flex justify-content-md-end">
            <Button
              variant="primary"
              onClick={() => setModalShow(true)}
              className="w-100 w-md-auto btn-gradient"
              style={{
                background: "linear-gradient(45deg, #4a6cf7, #6a11cb)",
                border: "none",
                transition: "all 0.3s",
                fontWeight: 500,
              }}
              onMouseEnter={() => setHoveredButton("create")}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <FaPlus className="me-2" /> Create New Question
            </Button>
          </Col>
        </Row>
      </div>

      <Row className="mb-3">
        <Col>
          <div className="d-flex align-items-center">
            <small className="text-muted me-2">Sort by:</small>
            <ButtonGroup size="sm">
              <Button
                variant={
                  sortField === "text" ? "secondary" : "outline-secondary"
                }
                onClick={() => toggleSort("text")}
                className="d-flex align-items-center"
              >
                Question{" "}
                {sortField === "text" &&
                  (sortDirection === "asc" ? (
                    <FaSortAmountUp className="ms-1" />
                  ) : (
                    <FaSortAmountDown className="ms-1" />
                  ))}
              </Button>
              <Button
                variant={
                  sortField === "type" ? "secondary" : "outline-secondary"
                }
                onClick={() => toggleSort("type")}
                className="d-flex align-items-center"
              >
                Type{" "}
                {sortField === "type" &&
                  (sortDirection === "asc" ? (
                    <FaSortAmountUp className="ms-1" />
                  ) : (
                    <FaSortAmountDown className="ms-1" />
                  ))}
              </Button>
              <Button
                variant={
                  sortField === "category" ? "secondary" : "outline-secondary"
                }
                onClick={() => toggleSort("category")}
                className="d-flex align-items-center"
              >
                Category{" "}
                {sortField === "category" &&
                  (sortDirection === "asc" ? (
                    <FaSortAmountUp className="ms-1" />
                  ) : (
                    <FaSortAmountDown className="ms-1" />
                  ))}
              </Button>
            </ButtonGroup>
          </div>
        </Col>
      </Row>

      {currentQuestions.length === 0 ? (
        <div className="text-center bg-light p-5 rounded shadow-sm my-4">
          <FaQuestionCircle size={50} className="mb-3 text-muted" />
          <h4>No Questions Found</h4>
          <p className="text-muted">
            Try adjusting your search or filters, or create a new question.
          </p>
        </div>
      ) : (
        <div>
          {currentQuestions.map((q) => (
            <Card
              key={q._id}
              className="mb-3 border-0 shadow-sm"
              style={{
                transition: "all 0.3s ease",
                transform: hoveredCard === q._id ? "translateY(-5px)" : "none",
                boxShadow:
                  hoveredCard === q._id
                    ? "0 8px 25px rgba(0, 0, 0, 0.1)"
                    : "0 3px 15px rgba(0, 0, 0, 0.08)",
              }}
              onMouseEnter={() => setHoveredCard(q._id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card.Body>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <Badge
                    bg={getTypeBadgeColor(q.type)}
                    className="py-2 px-3 rounded-pill"
                  >
                    {getTypeIcon(q.type)} {getTypeLabel(q.type)}
                  </Badge>
                  <Badge
                    bg={getCategoryColor(q.category)}
                    className="py-2 px-3 rounded-pill"
                  >
                    <FaTag className="me-1" /> {q.category}
                  </Badge>
                  {q.hidden && (
                    <Badge bg="secondary" className="py-2 px-3 rounded-pill">
                      <FaEyeSlash className="me-1" /> Hidden
                    </Badge>
                  )}
                </div>

                <h4 className="fw-bold text-primary mb-3">{q.text}</h4>

                {q.description && (
                  <p className="text-muted mb-3">
                    <FaInfoCircle className="me-2" /> {q.description}
                  </p>
                )}

                {/* Show Options for Single/Multiple Choice */}
                {(q.type === "single" || q.type === "multiple") &&
                  q.options.length > 0 && (
                    <div className="mb-3">
                      <strong>Options:</strong>
                      <ul className="list-unstyled mt-2">
                        {q.options.map((option, index) => (
                          <li
                            key={index}
                            className={`d-flex align-items-center p-2 mb-2 rounded ${
                              option.isCorrect
                                ? "bg-success bg-opacity-10"
                                : "bg-light"
                            }`}
                          >
                            {option.isCorrect ? (
                              <FaCheck className="text-success me-2" />
                            ) : (
                              <FaRegSquare className="text-muted me-2" />
                            )}
                            {option.text}
                            {option.isCorrect && (
                              <Badge bg="success" pill className="ms-2">
                                Correct
                              </Badge>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Show Correct Answer for True/False & Short */}
                {(q.type === "true_false" || q.type === "short") && (
                  <div className="mt-3 p-3 bg-light rounded">
                    <strong>Correct Answer:</strong>{" "}
                    <span className="text-success fw-bold">
                      {q.correctAnswer.toString()}
                    </span>
                  </div>
                )}

                <div className="d-flex justify-content-end mt-3 gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => {
                      setEditQuestion(q);
                      setModalShow(true);
                    }}
                    className="d-flex align-items-center"
                    style={{
                      transition: "all 0.2s",
                      transform:
                        hoveredButton === `edit-${q._id}`
                          ? "translateY(-2px)"
                          : "none",
                    }}
                    onMouseEnter={() => setHoveredButton(`edit-${q._id}`)}
                    onMouseLeave={() => setHoveredButton(null)}
                  >
                    <FaEdit className="me-1" /> Edit
                  </Button>

                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(q._id)}
                    className="d-flex align-items-center"
                    style={{
                      transition: "all 0.2s",
                      transform:
                        hoveredButton === `delete-${q._id}`
                          ? "translateY(-2px)"
                          : "none",
                    }}
                    onMouseEnter={() => setHoveredButton(`delete-${q._id}`)}
                    onMouseLeave={() => setHoveredButton(null)}
                  >
                    <FaTrashAlt className="me-1" /> Delete
                  </Button>

                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => toggleHide(q._id, q.hidden)}
                    className="d-flex align-items-center"
                    style={{
                      transition: "all 0.2s",
                      transform:
                        hoveredButton === `hide-${q._id}`
                          ? "translateY(-2px)"
                          : "none",
                    }}
                    onMouseEnter={() => setHoveredButton(`hide-${q._id}`)}
                    onMouseLeave={() => setHoveredButton(null)}
                  >
                    {q.hidden ? (
                      <FaEye className="me-1" />
                    ) : (
                      <FaEyeSlash className="me-1" />
                    )}
                    {q.hidden ? " Show" : " Hide"}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {filteredQuestions.length > questionsPerPage && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.First
              onClick={() => paginate(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            />

            {[
              ...Array(Math.ceil(filteredQuestions.length / questionsPerPage)),
            ].map((_, idx) => {
              // Show limited page numbers with ellipsis
              if (
                idx === 0 ||
                idx ===
                  Math.ceil(filteredQuestions.length / questionsPerPage) - 1 ||
                (idx >= currentPage - 2 && idx <= currentPage + 0)
              ) {
                return (
                  <Pagination.Item
                    key={idx + 1}
                    active={idx + 1 === currentPage}
                    onClick={() => paginate(idx + 1)}
                  >
                    {idx + 1}
                  </Pagination.Item>
                );
              } else if (idx === currentPage - 3 || idx === currentPage + 1) {
                return <Pagination.Ellipsis key={`ellipsis-${idx}`} />;
              }
              return null;
            })}

            <Pagination.Next
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage ===
                Math.ceil(filteredQuestions.length / questionsPerPage)
              }
            />
            <Pagination.Last
              onClick={() =>
                paginate(Math.ceil(filteredQuestions.length / questionsPerPage))
              }
              disabled={
                currentPage ===
                Math.ceil(filteredQuestions.length / questionsPerPage)
              }
            />
          </Pagination>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        show={modalShow}
        onHide={() => {
          setModalShow(false);
          setEditQuestion(null);
        }}
        centered
        size="lg"
      >
        <Modal.Header closeButton className="bg-primary text-white border-0">
          <Modal.Title className="d-flex align-items-center">
            {editQuestion ? (
              <>
                <FaEdit className="me-2" /> Edit Question
              </>
            ) : (
              <>
                <FaPlus className="me-2" /> Create New Question
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Title */}
            <Form.Group className="mb-3">
              <Form.Label>Question Text</Form.Label>
              <Form.Control
                type="text"
                value={editQuestion ? editQuestion.text : newQuestion.text}
                onChange={(e) =>
                  editQuestion
                    ? setEditQuestion({ ...editQuestion, text: e.target.value })
                    : setNewQuestion({ ...newQuestion, text: e.target.value })
                }
                placeholder="Enter question text"
                className="py-2"
              />
            </Form.Group>

            {/* Description */}
            <Form.Group className="mb-3">
              <Form.Label>Description (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={
                  editQuestion
                    ? editQuestion.description
                    : newQuestion.description
                }
                onChange={(e) =>
                  editQuestion
                    ? setEditQuestion({
                        ...editQuestion,
                        description: e.target.value,
                      })
                    : setNewQuestion({
                        ...newQuestion,
                        description: e.target.value,
                      })
                }
                placeholder="Enter additional details or context for the question"
                className="py-2"
              />
            </Form.Group>

            <Row>
              {/* Type (Dropdown) */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Question Type</Form.Label>
                  <Form.Select
                    value={editQuestion ? editQuestion.type : newQuestion.type}
                    onChange={(e) => {
                      const type = e.target.value;
                      if (editQuestion) {
                        setEditQuestion({
                          ...editQuestion,
                          type,
                          options:
                            type === "single" || type === "multiple"
                              ? []
                              : editQuestion.options,
                          correctAnswer:
                            type === "short" || type === "true_false"
                              ? ""
                              : editQuestion.correctAnswer,
                        });
                      } else {
                        setNewQuestion({
                          ...newQuestion,
                          type,
                          options:
                            type === "single" || type === "multiple"
                              ? []
                              : newQuestion.options,
                          correctAnswer:
                            type === "short" || type === "true_false"
                              ? ""
                              : newQuestion.correctAnswer,
                        });
                      }
                    }}
                    className="py-2"
                  >
                    <option value="">Select Question Type</option>
                    <option value="single">Single Choice</option>
                    <option value="multiple">Multiple Choice</option>
                    <option value="true_false">True/False</option>
                    <option value="short">Short Answer</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Category */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      editQuestion
                        ? editQuestion.category
                        : newQuestion.category
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
                    placeholder="Enter category (e.g., Math, Science, History)"
                    className="py-2"
                    list="categoryOptions"
                  />
                  <datalist id="categoryOptions">
                    {[...new Set(questions.map((q) => q.category))].map(
                      (category, index) => (
                        <option key={index} value={category} />
                      )
                    )}
                  </datalist>
                </Form.Group>
              </Col>
            </Row>

            {/* Options (For Single & Multiple Choice) */}
            {(editQuestion?.type === "single" ||
              editQuestion?.type === "multiple" ||
              newQuestion?.type === "single" ||
              newQuestion?.type === "multiple") && (
              <Form.Group className="mb-3">
                <Form.Label>Answer Options</Form.Label>
                <div className="mb-2 text-muted small">
                  {editQuestion?.type === "single" ||
                  newQuestion?.type === "single"
                    ? "Select one correct answer option by checking the box."
                    : "Select multiple correct answers by checking the boxes."}
                </div>
                {(editQuestion
                  ? editQuestion.options
                  : newQuestion.options
                ).map((option, index) => (
                  <div
                    key={index}
                    className="input-group mb-2 border rounded overflow-hidden"
                  >
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
                      placeholder={`Option ${index + 1}`}
                      className="border-0"
                    />
                    <div className="input-group-text bg-white border-0">
                      <Form.Check
                        type="checkbox"
                        checked={option.isCorrect}
                        onChange={(e) => {
                          const newOptions = editQuestion
                            ? [...editQuestion.options]
                            : [...newQuestion.options];

                          // For single choice, uncheck all other options
                          if (
                            (editQuestion?.type === "single" ||
                              newQuestion?.type === "single") &&
                            e.target.checked
                          ) {
                            newOptions.forEach((opt, i) => {
                              newOptions[i].isCorrect = i === index;
                            });
                          } else {
                            newOptions[index].isCorrect = e.target.checked;
                          }

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
                        label="Correct"
                      />
                    </div>
                    <Button
                      variant="danger"
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
                      className="border-0"
                    >
                      <FaTrashAlt />
                    </Button>
                  </div>
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
                  className="d-flex align-items-center mt-2"
                >
                  <FaPlus className="me-2" /> Add Option
                </Button>
              </Form.Group>
            )}

            {/* True/False Options */}
            {(editQuestion?.type === "true_false" ||
              newQuestion?.type === "true_false") && (
              <Form.Group className="mb-3">
                <Form.Label>Correct Answer</Form.Label>
                <div className="d-flex gap-3">
                  <Form.Check
                    type="radio"
                    id="true-option"
                    label="True"
                    name="true-false"
                    checked={
                      (editQuestion
                        ? editQuestion.correctAnswer
                        : newQuestion.correctAnswer) === "true"
                    }
                    onChange={() =>
                      editQuestion
                        ? setEditQuestion({
                            ...editQuestion,
                            correctAnswer: "true",
                          })
                        : setNewQuestion({
                            ...newQuestion,
                            correctAnswer: "true",
                          })
                    }
                  />
                  <Form.Check
                    type="radio"
                    id="false-option"
                    label="False"
                    name="true-false"
                    checked={
                      (editQuestion
                        ? editQuestion.correctAnswer
                        : newQuestion.correctAnswer) === "false"
                    }
                    onChange={() =>
                      editQuestion
                        ? setEditQuestion({
                            ...editQuestion,
                            correctAnswer: "false",
                          })
                        : setNewQuestion({
                            ...newQuestion,
                            correctAnswer: "false",
                          })
                    }
                  />
                </div>
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
                  placeholder="Enter the correct answer"
                  className="py-2"
                />
              </Form.Group>
            )}

            {/* Hidden Checkbox */}
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="hidden-switch"
                label="Hidden from students"
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

            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setModalShow(false);
                  setEditQuestion(null);
                }}
                className="me-2"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={
                  editQuestion ? handleUpdateQuestion : handleCreateQuestion
                }
                className="px-4"
                style={{
                  background: "linear-gradient(45deg, #4a6cf7, #6a11cb)",
                  border: "none",
                  fontWeight: 500,
                }}
              >
                {editQuestion ? "Update Question" : "Create Question"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default QuestList;
