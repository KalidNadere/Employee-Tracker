const connection = require('../util/database');

class Role {
  static async viewAllRoles() {
    const [rows, fields] = await connection.execute('SELECT * FROM Roles');
    return rows;
  }

  static async addRole(title, salary, departmentId) {
    const [result] = await connection.execute(
      'INSERT INTO Roles (title, salary, departmentId) VALUES (?, ?, ?)',
      [title, salary, departmentId]
    );
    return result.insertId;
  }

  static async updateRole(roleId, title, salary, departmentId) {
    const [result] = await connection.execute(
      'UPDATE Roles SET title = ?, salary = ?, departmentId = ? WHERE id = ?',
      [title, salary, departmentId, roleId]
    );
    return result.affectedRows > 0;
  }

  static async deleteRole(roleId) {
    const [result] = await connection.execute('DELETE FROM Roles WHERE id = ?', [roleId]);
    return result.affectedRows > 0;
  }

}

module.exports = Role;
