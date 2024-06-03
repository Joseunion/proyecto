describe('Signup', () => {
  it('Carga la página', () => {
    cy.visit(`${Cypress.env("host")}/signup`)
  }),

  it('Crear cuenta', () => {
    cy.visit(`${Cypress.env("host")}/signup`)
    cy.get("#username").type('username')
    cy.get("#email").type('email@example.com')
    cy.get("#fechaNacimiento").type('2001-11-23')
    cy.get("#password").type('password')
    cy.get("#passwordConfirmation").type('password')
    //cy.get("[type='submit']").click()
    //cy.wait(2000)
    //cy.url().should('eq', `${Cypress.env("host")}/login`)
  })

  it('Contraseñas no coincidentes', () => {
    cy.visit(`${Cypress.env("host")}/signup`)
    cy.get("#username").type('username')
    cy.get("#email").type('email@example.com')
    cy.get("#fechaNacimiento").type('2001-11-23')
    cy.get("#password").type('password')
    cy.get("#passwordConfirmation").type('password1')
    cy.get("[type='submit']").click()
    cy.wait(2000)
    cy.url().should('eq', `${Cypress.env("host")}/signup`)
  })

  it('Pulsar iniciar sesion', () => {
    cy.visit(`${Cypress.env("host")}/signup`)
    cy.get('a').contains('Inicia sesión con ella').click()
    cy.url().should('eq', `${Cypress.env("host")}/login`)
  })
})
