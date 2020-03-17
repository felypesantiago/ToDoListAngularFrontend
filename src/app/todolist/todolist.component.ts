import { Component, OnInit } from '@angular/core';
import { ToDoItemService } from '../services/to-do-item-service';
import { IToDoList } from '../model/itodolist';
import { IToDoItem } from '../model/itodoitem';

@Component({
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent implements OnInit {

  listItems: IToDoList;

  constructor(private toDoItemService: ToDoItemService) {
  }

  delete(item: IToDoItem): void {
    this.toDoItemService.deleteItem(item.id).subscribe(__ => this.ngOnInit(), error => console.log(error));
  }

  ngOnInit(): void {
    this.toDoItemService.getToDoItems()
      .subscribe(listItems => this.listItems = listItems, error => console.log(error));
  }

}
