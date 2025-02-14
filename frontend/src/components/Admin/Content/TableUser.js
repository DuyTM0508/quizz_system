const TableUser = (props) => {
  const {
    listUser,
    handleClickBtnUpdate,
    handleClickBtnView,
    handleClickBtnDelete,
  } = props;

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
                  <tr key={`table-users-${user.id}`}>
                    <th>{user.id}</th>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
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
    </>
  );
};

export default TableUser;
