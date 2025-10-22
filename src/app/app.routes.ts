import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { TableUsersComponent } from './pages/table-users/table-users.component';
import { UserComponent } from './pages/user/user.component';
import { AddUser } from './pages/add-user/add-user.interface';
import { AddUserComponent } from './pages/add-user/add-user.component';
import { ArticleListComponent } from './pages/articles/article-list/article-list.component';
import { ArticleDetailComponent } from './pages/articles/article-detail/article-detail.component';
import { CommentThreadComponent } from './pages/articles/comments/comments.component';
import { LayoutComponent } from './layout/layout.component';
import { ArticleFormComponent } from './pages/articles/form-article/form-article.component';
import { AuthGuard } from './pages/shared/authGuard/authGard';

export const routes: Routes = [
    {
        path: '', redirectTo:'login', pathMatch:'full'
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'register',
        component:RegisterComponent
    },
    {
        path:'',
        canActivate : [AuthGuard],
        component: LayoutComponent,
        children:[
            {
                path: 'articles',
                component: ArticleListComponent
              },
              {
                path: 'articles/create',
                component: ArticleFormComponent
              },
              {
                path: 'articles/edit/:id',
                component: ArticleFormComponent
              },
              {
                path: 'articles/:id',
                component: ArticleDetailComponent
              },
              {
                path: 'comments/:articleId',
                component: CommentThreadComponent
              },
            {
                path:'users',
                component:TableUsersComponent
            },
            {
                path:'update-user',
                component:UserComponent
            },
            {
                path:'create-user',
                component:AddUserComponent
            },
        ]
    }
];
