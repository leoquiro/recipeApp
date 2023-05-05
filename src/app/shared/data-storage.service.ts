import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipesService: RecipeService,
    private authService: AuthService
  ) {}

  storerecipes() {
    const recipes = this.recipesService.getRecipes();
    this.http
      .put(
        'https://ng-recipe-app-230754-default-rtdb.firebaseio.com/recipes.json',
        recipes
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.authService.user.pipe(
      take(1), 
      exhaustMap(user => {
      return this.http.get<Recipe[]>(
          'https://ng-recipe-app-230754-default-rtdb.firebaseio.com/recipes.json'
        ).pipe(
          map((recipes) => {
            // map here is an rsjx operator
            return recipes.map((recipe) => {
              return {
                ...recipe,
                ingredients: recipe.ingredients ? recipe.ingredients : [],
              };
            }); // map here is a regular js map
          }),
        )
    }),
        tap((recipes) => {
          this.recipesService.setRecipes(recipes);
          
        }) 
    );
  }
}
