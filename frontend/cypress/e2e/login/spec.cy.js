describe('Login', () => {
  it('Carga la página', () => {
    cy.visit(`${Cypress.env("host")}/login`)
  }),

  it('Email incorrecto', () => {
    cy.visit(`${Cypress.env("host")}/login`)
    cy.get("[type='email']").type('estonoesunemail')
    cy.get("[type='password']").type('contrasena')
    cy.get("[type='submit']").click()
    cy.wait(2000)
    cy.url().should('eq', `${Cypress.env("host")}/login`)
  })

  it('Password incorrecta', () => {
    cy.visit(`${Cypress.env("host")}/login`)
    cy.get("[type='email']").type(Cypress.env("emailExistente"))
    cy.get("[type='password']").type('ahsfjsjkakhfaskj')
    cy.get("[type='submit']").click()
    cy.wait(2000)
    cy.url().should('eq', `${Cypress.env("host")}/login`)
  })

  it('Email correcto', () => {
    cy.visit(`${Cypress.env("host")}/login`)
    cy.get("[type='email']").type(Cypress.env("emailExistente"))
    cy.get("[type='password']").type(Cypress.env("passwordExistente"))
    cy.get("[type='submit']").click()
    cy.wait(2000)
    cy.url().should('eq', `${Cypress.env("host")}/`)
  })

  it('Pulsar crear cuenta', () => {
    cy.visit(`${Cypress.env("host")}/login`)
    cy.get('a').contains('Crea').click()
    cy.url().should('eq', `${Cypress.env("host")}/signup`)
  })
})
