import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { TableUsersComponent } from './pages/table-users/table-users.component';
import { UserComponent } from './pages/user/user.component';
import { AddUser } from './pages/add-user/add-user.interface';
import { AddUserComponent } from './pages/add-user/add-user.component';

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
        children:[
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
            }
            
        ]
    }
];
