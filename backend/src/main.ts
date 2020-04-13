import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/websockets';
import * as socketio from 'socket.io';
import * as expressSession from 'express-session';
import * as passport from 'passport';
import * as config from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const secret = process.env.secret ? process.env.secret : config.get('jwt').secret;
  const PORT = process.env.port ? process.env.port : config.get('server').port;
  // Add websocket on your server
  app.useWebSocketAdapter(new WsAdapter(app.getHttpServer()));
  // Connecting sockets to the server and adding them to the request
  // so that we can access them later in the controller
  const io = socketio(app.getHttpServer());
  app.setGlobalPrefix(io);

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(expressSession({
    secret: secret,
    resave: true,
    saveUninitialized: true,
  }));

  const server = await app.listen(PORT);
  console.log(`Server listening on PORT - ${server.address().port}`);

}
bootstrap();