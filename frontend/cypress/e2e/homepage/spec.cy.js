describe('Homepage', () => {
  it('Carga la página', () => {
    cy.visit(`${Cypress.env("host")}/`)
  })

  it('Sin iniciar sesión', () => {
    cy.visit(`${Cypress.env("host")}/`)
    cy.get("a").contains("Iniciar sesión").should("exist")
  })

  it('Con sesión iniciada', () => {
    cy.visit(`${Cypress.env("host")}/login`)
    cy.get("[type='email']").type(Cypress.env("emailExistente"))
    cy.get("[type='password']").type(Cypress.env("passwordExistente"))
    cy.get("[type='submit']").click()
    cy.wait(2000)
    cy.url().should('eq', `${Cypress.env("host")}/`)
    cy.get("button").contains(Cypress.env("nombreExistente")).should("exist")
  })

  it('Pulsar navbar: Inicio', () => {
    cy.visit(`${Cypress.env("host")}/`)
    cy.get('a').contains('Inicio').click()
    cy.url().should('eq', `${Cypress.env("host")}/`)
  })

  it('Pulsar navbar: Peliculas', () => {
    cy.visit(`${Cypress.env("host")}/`)
    cy.get('a').contains('Películas').click()
    cy.url().should('eq', `${Cypress.env("host")}/peliculas`)
  })

  it('Pulsar navbar: Juegos', () => {
    cy.visit(`${Cypress.env("host")}/`)
    cy.get('a').contains('Juegos').click()
    cy.url().should('eq', `${Cypress.env("host")}/juegos`)
  })

  it('Pulsar navbar: Musica', () => {
    cy.visit(`${Cypress.env("host")}/`)
    cy.get('a').contains('Música').click()
    cy.url().should('eq', `${Cypress.env("host")}/musica`)
  })

  it('Pulsar navbar: Libros', () => {
    cy.visit(`${Cypress.env("host")}/`)
    cy.get('a').contains('Libros').click()
    cy.url().should('eq', `${Cypress.env("host")}/libros`)
  })
  
})
