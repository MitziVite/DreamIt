// export class Goal{
//     public id: string;
//     public title: string;
//     public description: string;
//     public dueDate: Date | null;
//     public completed: boolean;
//     constructor(id: string, title: string, description: string = '', dueDate: Date | null = null, completed: boolean = false) {
//         this.id = id;
//         this.title = title;
//         this.description = description;
//         this.dueDate = dueDate;
//         this.completed = completed;
//     } {}
// }


export class Goal {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public dueDate: Date | null = null,
    public completed: boolean = false
  ) {}
}