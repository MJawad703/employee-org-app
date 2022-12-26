interface Employee {
  uniqueId: number;
  name: string;
  subordinates: Employee[];
}

const ceo: Employee = {
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
              subordinates: [],
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
                      subordinates: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
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
              subordinates: [],
            },
          ],
        },
        {
          uniqueId: 11,
          name: "George Carrey",
          subordinates: [],
        },
        {
          uniqueId: 12,
          name: "Gary Styles",
          subordinates: [],
        },
      ],
    },
    {
      uniqueId: 13,
      name: "Georgina Wills",
      subordinates: [],
    },
    {
      uniqueId: 14,
      name: "Georgina Flangy",
      subordinates: [
        {
          uniqueId: 15,
          name: "Sophie turner",
          subordinates: [],
        },
      ],
    },
  ],
};

interface IEmployeeOrgApp {
  ceo: Employee;
  /* move method to move an employee to a new supervisor */
  move(employeeID: number, supervisorID: number): void;
  /** Undo last move action */
  undo(): void;
  /** Redo last undone action */
  redo(): void;
}

class EmployeeOrgApp implements IEmployeeOrgApp {
  private actions: Array<{
    ceo: Employee;
  }> = [];
  private currentActionIndex = -1;

  constructor(public ceo: Employee) {}

  move(employeeID: number, supervisorID: number): void {
    // store the previous state of the app object in the actions array
    this.actions.push({ ceo: JSON.parse(JSON.stringify(this.ceo)) });
    this.currentActionIndex++;

    // perform the move operation
    const employee = this.findEmployeeById(employeeID);
    if (!employee) {
      throw new Error(`Employee with ID ${employeeID} not found`);
    }

    const oldSupervisor = this.findSupervisorById(employeeID);
    if (!oldSupervisor) {
      throw new Error(
        `Supervisor for employee with ID ${employeeID} not found`
      );
    }

    const newSupervisor = this.findEmployeeById(supervisorID);
    if (!newSupervisor) {
      throw new Error(`Employee with ID ${supervisorID} not found`);
    }

    // remove employee from old supervisor's subordinates list
    oldSupervisor.subordinates = oldSupervisor.subordinates.filter(
      (e) => e.uniqueId !== employee.uniqueId
    );

    // add employee's subordinates to old supervisor's subordinates list
    oldSupervisor.subordinates.push(...employee.subordinates);

    // remove employee's subordinates from employee
    employee.subordinates = [];

    // add employee to new supervisor's subordinates list
    newSupervisor.subordinates.push(employee);
  }

  undo(): void {
    // check if there are any actions to undo
    if (this.currentActionIndex < 0) {
      throw new Error(`there is no action to be undo`);
      return;
    }

    // get the previous state of the app object
    const { ceo } = this.actions[this.currentActionIndex];

    // undo the move operation by restoring the previous state of the app object
    this.ceo = ceo;

    // move back to previous action
    this.currentActionIndex--;
  }

  findEmployeeById(employeeID: number): Employee | undefined {
    const queue = [this.ceo];
    while (queue.length > 0) {
      const employee = queue.shift();
      if (employee.uniqueId === employeeID) {
        return employee;
      }
      queue.push(...employee.subordinates);
    }
    return undefined;
  }

  findSupervisorById(employeeID: number): Employee | undefined {
    const queue = [this.ceo];
    while (queue.length > 0) {
      const supervisor = queue.shift();
      for (const subordinate of supervisor.subordinates) {
        if (subordinate.uniqueId === employeeID) {
          return supervisor;
        }
        queue.push(subordinate);
      }
    }
    return undefined;
  }
}

const app = new EmployeeOrgApp(ceo);

app.move(5, 13);

app.undo();

console.log(app);
