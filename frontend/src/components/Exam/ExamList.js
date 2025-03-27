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
  Row,
  Col,
  Badge,
  Dropdown,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaEye,
  FaEyeSlash,
  FaQuestionCircle,
  FaClock,
  FaTag,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import "./ExamList.css";

const API_URL = "http://localhost:9999/exams";

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");
  const [newExam, setNewExam] = useState({
    title: "",
    description: "",
    category: "",
    duration: 0,
    hidden: false,
  });
  const [editExam, setEditExam] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterHidden, setFilterHidden] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const examsPerPage = 5;

  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (exams.length > 0) {
      const uniqueCategories = [...new Set(exams.map((exam) => exam.category))];
      setCategories(uniqueCategories);
    }
  }, [exams]);

  const fetchExams = async () => {
    try {
      const res = await axios.get(API_URL);
      console.log("res.data:", res.data);

      const examData = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.DT)
        ? res.data.DT
        : [];

      setExams(examData);
    } catch (err) {
      console.error("Error fetching exams:", err);
    }
  };

  const handleCreateExam = async () => {
    try {
      const res = await axios.post(API_URL, newExam);
      const createdExam = res.data.DT || res.data;
      setExams([...exams, createdExam]);
      setNewExam({
        title: "",
        description: "",
        category: "",
        duration: 0,
        hidden: false,
      });
      setModalShow(false);
    } catch (err) {
      console.error("Error creating exam:", err);
    }
  };

  const handleUpdateExam = async () => {
    const confirmEdit = window.confirm("Xác nhận cập nhật bài thi?");
    if (!confirmEdit) return;

    try {
      await axios.put(`${API_URL}/${editExam._id}`, editExam);
      setExams(exams.map((e) => (e._id === editExam._id ? editExam : e)));
      setEditExam(null);
      setModalShow(false);
    } catch (err) {
      console.error("Error updating exam:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa bài thi này?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setExams(exams.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Error deleting exam:", err);
    }
  };

  const toggleHide = async (id, hiddenStatus) => {
    try {
      await axios.put(`${API_URL}/${id}`, { hidden: !hiddenStatus });
      setExams(
        exams.map((e) => (e._id === id ? { ...e, hidden: !e.hidden } : e))
      );
    } catch (err) {
      console.error("Error toggling hidden:", err);
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

  const sortExams = (a, b) => {
    if (sortField === "title") {
      return sortDirection === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (sortField === "duration") {
      return sortDirection === "asc"
        ? a.duration - b.duration
        : b.duration - a.duration;
    } else if (sortField === "category") {
      return sortDirection === "asc"
        ? a.category.localeCompare(b.category)
        : b.category.localeCompare(a.category);
    }
    return 0;
  };

  let filteredExams = Array.isArray(exams)
    ? exams.filter(
        (e) =>
          (e.title.toLowerCase().includes(search.toLowerCase()) ||
            e.description.toLowerCase().includes(search.toLowerCase())) &&
          (selectedCategory === "All" || e.category === selectedCategory) &&
          (filterHidden ? true : !e.hidden)
      )
    : [];

  filteredExams = filteredExams.sort(sortExams);

  const indexOfLast = currentPage * examsPerPage;
  const indexOfFirst = indexOfLast - examsPerPage;
  const currentExams = filteredExams.slice(indexOfFirst, indexOfLast);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getCategoryColor = (category) => {
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

  return (
    <Container className="mt-4 exam-list-container">
      <div className="header-section mb-4">
        <h1 className="text-center mb-4">
          <span className="exam-title">Exam Management</span>
        </h1>
        <p className="text-center text-muted">
          Manage your exams, create new ones, or modify existing tests
        </p>
      </div>

      <Row className="mb-4 search-filter-section">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text className="search-icon">
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </InputGroup>
        </Col>
        <Col md={6} className="d-flex justify-content-end">
          <ButtonGroup className="me-2">
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-secondary"
                id="dropdown-category"
              >
                <FaFilter className="me-1" /> {selectedCategory}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSelectedCategory("All")}>
                  All Categories
                </Dropdown.Item>
                <Dropdown.Divider />
                {categories.map((category) => (
                  <Dropdown.Item
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </ButtonGroup>

          <ButtonGroup className="me-2">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Toggle hidden exams</Tooltip>}
            >
              <Button
                variant={filterHidden ? "primary" : "outline-secondary"}
                onClick={() => setFilterHidden(!filterHidden)}
              >
                {filterHidden ? <FaEye /> : <FaEyeSlash />}
              </Button>
            </OverlayTrigger>
          </ButtonGroup>

          <Button
            variant="primary"
            onClick={() => setModalShow(true)}
            className="create-btn"
          >
            <FaPlus className="me-1" /> Create Exam
          </Button>
        </Col>
      </Row>

      <Row className="mb-3 sort-section">
        <Col>
          <div className="d-flex align-items-center">
            <small className="text-muted me-2">Sort by:</small>
            <ButtonGroup size="sm">
              <Button
                variant={
                  sortField === "title" ? "secondary" : "outline-secondary"
                }
                onClick={() => toggleSort("title")}
                className="sort-btn"
              >
                Title{" "}
                {sortField === "title" &&
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
                className="sort-btn"
              >
                Category{" "}
                {sortField === "category" &&
                  (sortDirection === "asc" ? (
                    <FaSortAmountUp className="ms-1" />
                  ) : (
                    <FaSortAmountDown className="ms-1" />
                  ))}
              </Button>
              <Button
                variant={
                  sortField === "duration" ? "secondary" : "outline-secondary"
                }
                onClick={() => toggleSort("duration")}
                className="sort-btn"
              >
                Duration{" "}
                {sortField === "duration" &&
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

      {currentExams.length === 0 ? (
        <div className="text-center p-5 empty-state">
          <FaQuestionCircle size={50} className="mb-3 text-muted" />
          <h4>No Exams Found</h4>
          <p className="text-muted">
            Try adjusting your search or filters, or create a new exam.
          </p>
        </div>
      ) : (
        <div className="exam-cards">
          {currentExams.map((e) => (
            <Card
              key={e._id}
              className={`mb-3 exam-card ${e.hidden ? "hidden-exam" : ""}`}
            >
              <Card.Body>
                <div className="d-flex justify-content-center align-items-start">
                  <div>
                    <h4 className="exam-card-title">{e.title}</h4>
                    <Badge
                      bg={getCategoryColor(e.category)}
                      className="category-badge"
                    >
                      <FaTag className="me-1" /> {e.category}
                    </Badge>
                    {e.hidden && (
                      <Badge bg="secondary" className="ms-2">
                        <FaEyeSlash className="me-1" /> Hidden
                      </Badge>
                    )}
                  </div>
                  <div className="duration-badge">
                    <FaClock className="me-1" /> {e.duration} min
                  </div>
                </div>

                <Card.Text className="mt-3 exam-description">
                  {e.description}
                </Card.Text>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="d-flex gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => navigate(`/admin/exams/${e._id}`)}
                      className="action-btn"
                    >
                      <FaQuestionCircle className="me-1" /> Questions
                    </Button>
                  </div>

                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => {
                        setEditExam(e);
                        setModalShow(true);
                      }}
                      className="action-btn"
                    >
                      <FaEdit className="me-1" /> Edit
                    </Button>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(e._id)}
                      className="action-btn"
                    >
                      <FaTrashAlt className="me-1" /> Delete
                    </Button>

                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => toggleHide(e._id, e.hidden)}
                      className="action-btn"
                    >
                      {e.hidden ? (
                        <FaEye className="me-1" />
                      ) : (
                        <FaEyeSlash className="me-1" />
                      )}
                      {e.hidden ? "Show" : "Hide"}
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {filteredExams.length > examsPerPage && (
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

            {[...Array(Math.ceil(filteredExams.length / examsPerPage))].map(
              (_, idx) => {
                // Show limited page numbers with ellipsis
                if (
                  idx === 0 ||
                  idx === Math.ceil(filteredExams.length / examsPerPage) - 1 ||
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
              }
            )}

            <Pagination.Next
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(filteredExams.length / examsPerPage)
              }
            />
            <Pagination.Last
              onClick={() =>
                paginate(Math.ceil(filteredExams.length / examsPerPage))
              }
              disabled={
                currentPage === Math.ceil(filteredExams.length / examsPerPage)
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
          setEditExam(null);
        }}
        centered
        className="exam-modal"
      >
        <Modal.Header closeButton className="modal-header">
          <Modal.Title>
            {editExam ? (
              <>
                <FaEdit className="me-2" /> Edit Exam
              </>
            ) : (
              <>
                <FaPlus className="me-2" /> Create New Exam
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editExam ? editExam.title : newExam.title}
                onChange={(e) =>
                  editExam
                    ? setEditExam({ ...editExam, title: e.target.value })
                    : setNewExam({ ...newExam, title: e.target.value })
                }
                placeholder="Enter exam title"
                className="form-input"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editExam ? editExam.description : newExam.description}
                onChange={(e) =>
                  editExam
                    ? setEditExam({ ...editExam, description: e.target.value })
                    : setNewExam({ ...newExam, description: e.target.value })
                }
                placeholder="Enter exam description"
                className="form-input"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    value={editExam ? editExam.category : newExam.category}
                    onChange={(e) =>
                      editExam
                        ? setEditExam({ ...editExam, category: e.target.value })
                        : setNewExam({ ...newExam, category: e.target.value })
                    }
                    placeholder="Enter category"
                    className="form-input"
                    list="categoryOptions"
                  />
                  <datalist id="categoryOptions">
                    {categories.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration (minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    value={editExam ? editExam.duration : newExam.duration}
                    onChange={(e) =>
                      editExam
                        ? setEditExam({ ...editExam, duration: e.target.value })
                        : setNewExam({ ...newExam, duration: e.target.value })
                    }
                    min="1"
                    placeholder="Enter duration"
                    className="form-input"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Check
                type="switch"
                id="hidden-switch"
                label="Hidden from students"
                checked={editExam ? editExam.hidden : newExam.hidden}
                onChange={(e) =>
                  editExam
                    ? setEditExam({ ...editExam, hidden: e.target.checked })
                    : setNewExam({ ...newExam, hidden: e.target.checked })
                }
                className="form-switch"
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setModalShow(false);
                  setEditExam(null);
                }}
                className="me-2"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={editExam ? handleUpdateExam : handleCreateExam}
                className="submit-btn"
              >
                {editExam ? "Update Exam" : "Create Exam"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ExamList;
