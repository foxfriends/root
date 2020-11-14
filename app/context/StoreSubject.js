import { BehaviorSubject } from 'rxjs';

export default class StoreSubject extends BehaviorSubject {
  set(value) { this.next(value); }
}
