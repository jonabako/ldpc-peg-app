import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TuiRootModule } from '@taiga-ui/core';
import { TuiNavigationModule } from '@taiga-ui/experimental';
import { TuiIconModule } from '@taiga-ui/experimental';
import { TuiHeaderModule } from '@taiga-ui/experimental';
import { TuiBadgeModule } from '@taiga-ui/kit';
import { TuiTabsModule } from '@taiga-ui/kit';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/kit';
import { TuiIslandModule } from '@taiga-ui/kit';
import { TuiButtonGroupModule } from '@taiga-ui/experimental';
import { TuiDataListModule } from '@taiga-ui/core';
import { TuiDataListWrapperModule, TuiSelectModule } from '@taiga-ui/kit';
import { TuiTextfieldControllerModule } from '@taiga-ui/core';
import { NgxGraphModule } from '@swimlane/ngx-graph';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    TuiRootModule,
    TuiNavigationModule,
    TuiIconModule,
    TuiHeaderModule,
    TuiBadgeModule,
    TuiTabsModule,
    TuiButtonModule,
    TuiInputModule,
    TuiIslandModule,
    TuiButtonGroupModule,
    TuiSelectModule,
    TuiDataListModule,
    TuiDataListWrapperModule,
    TuiTextfieldControllerModule,
    NgxGraphModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
