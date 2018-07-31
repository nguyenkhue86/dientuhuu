import { Tutorial } from './main/models/tutorial.model';
import { Title } from './main/models/title.model';
import { User } from './main/models/user.model';

export interface AppState {
  readonly tutorial: Tutorial[];
  readonly title: Title[];
  readonly user: User;
}