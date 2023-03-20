import { AppComponent } from "./app";

const app = new AppComponent();

app.addMiddleware();
app.addMethod();
app.run();
