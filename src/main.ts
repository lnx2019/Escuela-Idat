// src/main.ts
import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig)
  .catch((err: unknown) => console.error(err));


// import 'zone.js';
// import { bootstrapApplication } from '@angular/platform-browser';
// import { App } from './app/app';
// import { appConfig } from './app/app.config';
// import { provideHttpClient, withFetch } from '@angular/common/http';


// bootstrapApplication(App, appConfig)
// .catch((err: unknown) => console.error(err));
// provideHttpClient(withFetch());