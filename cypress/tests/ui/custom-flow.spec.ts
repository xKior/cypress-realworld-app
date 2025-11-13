// cypress/tests/ui/login.spec.ts

import LoginPage from '../../pages/LoginPage';

describe('The Login Page', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    // Reset y seed de la base de datos
    cy.task('db:seed');
    
    // Obtener usuario del seed
    cy.database('find', 'users').then((user: any) => {
      cy.wrap(user).as('currentUser');
    });
  });

  it('sets auth cookie when logging in via form submission', function () {
    const { username } = this.currentUser;

    loginPage.visit();
    cy.get('#username').type(username);
    cy.get('#password').type(`s3cret{enter}`);

    // Verificamos redirección con timeout mayor
    cy.url({ timeout: 10000 }).should('not.include', '/signin');

    // Cookie de auth debe existir
    cy.getCookie('connect.sid').should('exist');

    // UI refleja usuario logueado - verificamos que el home esté visible
    cy.get('[data-test="sidenav-home"]', { timeout: 10000 }).should('be.visible');
  });

  it('logs in using page object', function () {
    const { username } = this.currentUser;

    loginPage.visit();
    loginPage.login(username, 's3cret');

    cy.url().should('not.include', '/signin');
    cy.get('[data-test="sidenav-home"]').should('be.visible');
  });

  it('shows error with invalid credentials', () => {
    loginPage.visit();
    loginPage.login('invalid_user', 'wrong_pass');

    cy.get('[data-test="signin-error"]')
      .should('be.visible')
      .and('contain', 'Username or password is invalid');
  });
});