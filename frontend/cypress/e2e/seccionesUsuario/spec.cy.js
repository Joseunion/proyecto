describe('Secciones usuario', () => {
  beforeEach(() => {
    cy.visit(`${Cypress.env("host")}/login`)
    cy.get("[type='email']").type(Cypress.env("emailExistente"))
    cy.get("[type='password']").type(Cypress.env("passwordExistente"))
    cy.get("[type='submit']").click()
    cy.wait(2000)
    cy.url().should('eq', `${Cypress.env("host")}/`)
  }),

  it('Carga la página', () => {
    cy.url().should('eq', `${Cypress.env("host")}/`)
  })

  it('Click boton Perfil', () => {
    cy.url().should('eq', `${Cypress.env("host")}/`)
    cy.get("button").contains(Cypress.env("nombreExistente")).click()
    cy.get("a").get(".dropdown-item").contains("Perfil").click()
    cy.url().should('contain', `${Cypress.env("host")}/perfil/`)
  })

  it('Click boton Para mas tarde', () => {
    cy.url().should('eq', `${Cypress.env("host")}/`)
    cy.get("button").contains(Cypress.env("nombreExistente")).click()
    cy.get("a").get(".dropdown-item").contains("Para + tarde").click()
    cy.wait(2000)
    cy.url().should('eq', `${Cypress.env("host")}/paramastarde`)
  })

  it('Click boton Cerrar sesion', () => {
    cy.url().should('eq', `${Cypress.env("host")}/`)
    cy.get("button").contains(Cypress.env("nombreExistente")).click()
    cy.get("a").get(".dropdown-item").contains("Cerrar sesión").click()
    cy.wait(2000)
    cy.url().should('eq', `${Cypress.env("host")}/`)
    cy.get("a").contains("Iniciar sesión").should("exist")
  })
})
