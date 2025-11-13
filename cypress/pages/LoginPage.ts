// cypress/pages/LoginPage.ts

class LoginPage {
  visit() {
    cy.visit('/signin');
  }

  fillUsername(username: string) {
    cy.get('#username').type(username);
  }

  fillPassword(password: string) {
    cy.get('#password').type(password);
  }

  submit() {
    cy.get('[data-test="signin-submit"]').click();
  }

  login(username: string, password: string) {
    this.fillUsername(username);
    this.fillPassword(password);
    this.submit();
  }
}

export default LoginPage;