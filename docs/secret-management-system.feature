Feature: Secret Management System (SMS)

###
# Project - is
#                        -
###

###
# Role - is
#                        -
###

###
# Namespace - is a set of
#                        - permissions
#                        - secrets/variables
#                        - other namespaces
#                        - "integration" with applications
#                        - a thing which inherits and rewrites parental characteristics
###

###
# Application - is a last door to the actual users apps, and also
#                        - a set of needed secrets/variables it demands for "integration"
#                        - a thing existing outside of "main" screen with secrets/variables
###

###
# Integration - bridge, connection bettween namespaces and applications
###

  Scenario: Storing "secrets/variables"
    Given user on main screen
    When user saves secrets/variables
    Then saved secrets/variables are accessible

  Scenario: Secrets/variables each belongs to some "namespace"
    Given secrets/variables exists
    Then each secret/variable belongs to one or more namespaces

  Scenario: "Root" namespace
    Given user sees newly created project
    Then there are root namespace

  Scenario: Root namespace can't be deleted
    ...

  Scenario: Namespaces other then root could be deleted
    ...

  Scenario: Namespaces other then root should branch from some other namespace
    Given exists non-root namespace
    Then there are parent namespace to the mentioned child namespace
