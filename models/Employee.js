const connection = require('../util/database');

class Employee {
  static async viewAllEmployees() {
    const [rows, fields] = await connection.execute('SELECT * FROM Employees');
    return rows;
  }

  static async addEmployee(firstName, lastName, roleId, managerId) {
    const [result] = await connection.execute(
      'INSERT INTO Employees (firstName, lastName, roleId, managerId) VALUES (?, ?, ?, ?)',
      [firstName, lastName, roleId, managerId]
    );
    return result.insertId;
  }

  static async updateEmployee(employeeId, roleId) {
    const [result] = await connection.execute('UPDATE Employees SET roleId = ? WHERE id = ?', [roleId, employeeId]);
    return result.affectedRows > 0;
  }

  static async deleteEmployee(employeeId) {
    const [result] = await connection.execute('DELETE FROM Employees WHERE id = ?', [employeeId]);
    return result.affectedRows > 0;
  }

}

module.exports = Employee;
