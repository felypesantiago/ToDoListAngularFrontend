import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { IToDoItem } from '../model/itodoitem';
import { FormControlName, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';

import { GenericValidator } from '../shared/generic-validator';
import { ToDoItemService } from '../services/to-do-item-service';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-item-details-edit',
  templateUrl: './item-details-edit.component.html',
  styleUrls: ['./item-details-edit.component.css']
})
export class ItemDetailsEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  item: IToDoItem;

  errorMessage: string;

  itemForm: FormGroup;

  displayMessage: { [key: string]: string } = {};

  pageTitle: string;

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  private subscription: Subscription;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,
    private router: Router, private itemService: ToDoItemService) {

    this.validationMessages = {
      title: {
        required: 'Item title is required.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.itemForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ''
    })

    this.subscription = this.route.paramMap.subscribe(parameters => this.getItem(+parameters.get('id')));
  }

  getItem(id: number): void {
    if(id !== 0){
      this.itemService.getToDoItem(id).subscribe(item => this.displayItem(item), error => console.log(error));
    } else {
      this.pageTitle = 'Add Item';
    }
  }

  displayItem(item: IToDoItem): void {
    if (this.itemForm) {
      this.itemForm.reset();
    }
    this.item = item;

    this.pageTitle = `Edit Item: ${this.item.title}`;

    this.itemForm.patchValue({
      title: this.item.title,
      description: this.item.description
    });
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.itemForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.itemForm);
    });
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }

  saveItem(): void {
    if (this.itemForm.valid) {
      if (this.itemForm.dirty) {
        const changedItem = { ...this.item, ...this.itemForm.value };

        if (changedItem.id === undefined) {
          this.itemService.createToDoItem(changedItem)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: err => this.errorMessage = err
            });
        } else {
          this.itemService.updateToDoItem(changedItem)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: err => this.errorMessage = err
            });
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(): void {
    this.itemForm.reset();
    this.router.navigate(['/items']);
  }

}
