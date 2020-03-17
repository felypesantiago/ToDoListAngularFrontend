import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodolistComponent } from './todolist/todolist.component';
import { CreditsComponent } from './credits/credits.component';
import { ItemDetailsComponent } from './todolist/item-details.component';
import { ItemDetailsEditComponent } from './todolist/item-details-edit.component';

const routes: Routes = [
  { path: 'items/:id', component: ItemDetailsComponent },
  { path: 'items/:id/edit', component: ItemDetailsEditComponent },
  { path: 'credits', component: CreditsComponent },
  { path: 'todolist', component: TodolistComponent },
  { path: '', redirectTo: 'todolist', pathMatch: 'full' },
  { path: '**', redirectTo: 'todolist', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
