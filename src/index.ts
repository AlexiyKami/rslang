import AppModel from './components/app/app';
import View from './components/view/view';
import Controller from './components/controller/controller';

const app = new Controller(new AppModel(), new View());
