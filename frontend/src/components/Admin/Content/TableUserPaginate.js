import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

const TableUserPaginate = (props) => {
  const {
    listUser,
    handleClickBtnUpdate,
    handleClickBtnView,
    handleClickBtnDelete,
    fetchUserDataWithPaginate,
    pageCount,
    currentPage,
    setCurrentPage,
  } = props;

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    fetchUserDataWithPaginate(+event.selected + 1);
    setCurrentPage(+event.selected + 1);
    console.log(`User requested page number ${+event.selected}`);
  };

  return (
    <>
      <table className="table table-hover table-bordered">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">username</th>
            <th scope="col">email</th>
            <th scope="col">role</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {listUser &&
            listUser.length > 0 &&
            listUser
              .slice()
              .reverse()
              .map((user) => {
                return (
                  <tr key={user?._id || `table-users-${user._id}`}>
                    <th>{user._id}</th>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role ? "Admin" : "User"}</td>
                    <td>
                      <button
                        onClick={() => handleClickBtnView(user)}
                        className="btn btn-secondary"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleClickBtnUpdate(user)}
                        className="btn btn-warning mx-3"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleClickBtnDelete(user)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}

          {listUser && listUser.length === 0 && (
            <tr>
              <td colSpan={"4"}>Not found data</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="d-flex justify-content-center">
        <ReactPaginate
          nextLabel="Next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel="< Prev"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
          forcePage={currentPage - 1}
        />
      </div>
    </>
  );
};

export default TableUserPaginate;
