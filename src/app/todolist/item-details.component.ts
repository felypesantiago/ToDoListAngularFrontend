import { Component, OnInit } from '@angular/core';
import { IToDoItem } from '../model/itodoitem';
import { ActivatedRoute, Router } from '@angular/router';
import { ToDoItemService } from '../services/to-do-item-service';

@Component({
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {
  item: IToDoItem;

  constructor(private route: ActivatedRoute, private router: Router,
    private itemService: ToDoItemService) { }

  ngOnInit(): void {
    const itemId = this.route.snapshot.paramMap.get('id');

    if (itemId) {
      this.itemService.getToDoItem(+itemId).subscribe(item => this.item = item, error => console.log(error));
    }
  }

  onBack(): void {
    this.router.navigate(['/items']);
  }

}