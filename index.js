var ceo = {
    uniqueId: 1,
    name: "Mark Zuckerberg",
    subordinates: [
        {
            uniqueId: 2,
            name: "Sarah Donald",
            subordinates: [
                {
                    uniqueId: 3,
                    name: "Cassandra Reynolds",
                    subordinates: [
                        {
                            uniqueId: 4,
                            name: "Mary Blue",
                            subordinates: []
                        },
                        {
                            uniqueId: 5,
                            name: "Bob Saget",
                            subordinates: [
                                {
                                    uniqueId: 6,
                                    name: "Tina Teff",
                                    subordinates: [
                                        {
                                            uniqueId: 7,
                                            name: "Will Turner",
                                            subordinates: []
                                        },
                                    ]
                                },
                            ]
                        },
                    ]
                },
            ]
        },
        {
            uniqueId: 8,
            name: "Tyler Simspson",
            subordinates: [
                {
                    uniqueId: 9,
                    name: "Harry Tobs",
                    subordinates: [
                        {
                            uniqueId: 10,
                            name: "Thomas Brown",
                            subordinates: []
                        },
                    ]
                },
                {
                    uniqueId: 11,
                    name: "George Carrey",
                    subordinates: []
                },
                {
                    uniqueId: 12,
                    name: "Gary Styles",
                    subordinates: []
                },
            ]
        },
        {
            uniqueId: 13,
            name: "Georgina Wills",
            subordinates: []
        },
        {
            uniqueId: 14,
            name: "Georgina Flangy",
            subordinates: [
                {
                    uniqueId: 15,
                    name: "Sophie turner",
                    subordinates: []
                },
            ]
        },
    ]
};
var EmployeeOrgApp = /** @class */ (function () {
    function EmployeeOrgApp(ceo) {
        this.ceo = ceo;
        this.actions = [];
        this.currentActionIndex = -1;
    }
    EmployeeOrgApp.prototype.move = function (employeeID, supervisorID) {
        var _a;
        // store the previous state of the app object in the actions array
        this.actions.push({ ceo: JSON.parse(JSON.stringify(this.ceo)) });
        this.currentActionIndex++;
        // perform the move operation
        var employee = this.findEmployeeById(employeeID);
        if (!employee) {
            throw new Error("Employee with ID ".concat(employeeID, " not found"));
        }
        var oldSupervisor = this.findSupervisorById(employeeID);
        if (!oldSupervisor) {
            throw new Error("Supervisor for employee with ID ".concat(employeeID, " not found"));
        }
        var newSupervisor = this.findEmployeeById(supervisorID);
        if (!newSupervisor) {
            throw new Error("Employee with ID ".concat(supervisorID, " not found"));
        }
        // remove employee from old supervisor's subordinates list
        oldSupervisor.subordinates = oldSupervisor.subordinates.filter(function (e) { return e.uniqueId !== employee.uniqueId; });
        // add employee's subordinates to old supervisor's subordinates list
        (_a = oldSupervisor.subordinates).push.apply(_a, employee.subordinates);
        // remove employee's subordinates from employee
        employee.subordinates = [];
        // add employee to new supervisor's subordinates list
        newSupervisor.subordinates.push(employee);
    };
    EmployeeOrgApp.prototype.undo = function () {
        // check if there are any actions to undo
        if (this.currentActionIndex < 0) {
            throw new Error("there is no action to be undo");
            return;
        }
        // get the previous state of the app object
        var ceo = this.actions[this.currentActionIndex].ceo;
        // undo the move operation by restoring the previous state of the app object
        this.ceo = ceo;
        // move back to previous action
        this.currentActionIndex--;
    };
    EmployeeOrgApp.prototype.findEmployeeById = function (employeeID) {
        var queue = [this.ceo];
        while (queue.length > 0) {
            var employee = queue.shift();
            if (employee.uniqueId === employeeID) {
                return employee;
            }
            queue.push.apply(queue, employee.subordinates);
        }
        return undefined;
    };
    EmployeeOrgApp.prototype.findSupervisorById = function (employeeID) {
        var queue = [this.ceo];
        while (queue.length > 0) {
            var supervisor = queue.shift();
            for (var _i = 0, _a = supervisor.subordinates; _i < _a.length; _i++) {
                var subordinate = _a[_i];
                if (subordinate.uniqueId === employeeID) {
                    return supervisor;
                }
                queue.push(subordinate);
            }
        }
        return undefined;
    };
    return EmployeeOrgApp;
}());
var app = new EmployeeOrgApp(ceo);
app.move(5, 13);
app.undo();
console.log(app);
