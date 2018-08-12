import AppIntegrator from './app-integrator';
import AppFactory from './app-factory';
import * as vscode from 'vscode';

export default class AppIntegratorFactory {

    create() {
        const app = new AppFactory().create(vscode, console);
        return new AppIntegrator({app, vscode});
    }

}
