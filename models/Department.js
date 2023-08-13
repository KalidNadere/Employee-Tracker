const connection = require('../util/database');

class Department {
  static async viewAllDepartments() {
    const [rows, fields] = await connection.execute('SELECT * FROM Departments');
    return rows;
  }

  static async addDepartment(departmentName) {
    const [result] = await connection.execute('INSERT INTO Departments (departmentName) VALUES (?)', [departmentName]);
    return result.insertId;
  }

  static async deleteDepartment(departmentId) {
    const [result] = await connection.execute('DELETE FROM Departments WHERE id = ?', [departmentId]);
    return result.affectedRows > 0;
  }

}

module.exports = Department;
