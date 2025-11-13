// cypress/tests/ui/login.spec.ts

import LoginPage from '../../pages/LoginPage';

describe('The Login Page', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    // Reset y seed de la base de datos
    cy.task('db:seed');
  });

  it('shows error with invalid credentials', () => {
    loginPage.visit();
    loginPage.login('invalid_user', 'wrong_pass');

    cy.get('[data-test="signin-error"]')
      .should('be.visible')
      .and('contain', 'Username or password is invalid');
  });
});
