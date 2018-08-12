
import AppIntegratorFactory from './lib/app-integrator-factory';
import {ExtensionContext} from 'vscode';

exports.activate = (context: ExtensionContext) => {
    const appIntegrator = new AppIntegratorFactory().create();
    appIntegrator.integrate(context);
};

exports.deactivate = () => {};
