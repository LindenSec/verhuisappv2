// Basisstructuur voor categorieën, inclusief IKEA-integratie optie en itemsuggesties
const categoryStructure = {
  "Woonkamer": { 
    showIkea: true,
    suggestions: [
      "Bank of loungebank",
      "Salontafel",
      "TV-meubel",
      "Eettafel met stoelen",
      "Vloerkleed",
      "Gordijnen of raamdecoratie",
      "Lampen (plafond, staand, sfeer)",
      "Kast of boekenkast"
    ]
  },
  "Keuken": { 
    showIkea: true,
    suggestions: [
      "Bestek en bestekbak",
      "Pannenset",
      "Borden en servies",
      "Glazen en mokken",
      "Snijplank en messen",
      "Keukendoeken",
      "Afvalbak",
      "Keukenapparatuur",
      "Kruidenrek",
      "Opbergbakjes"
    ]
  },
  "Badkamer": { 
    showIkea: true,
    suggestions: [
      "Handdoeken (klein en groot)",
      "Badmat",
      "Douchegordijn",
      "Toiletborstel",
      "Wasmand",
      "Badkamerkast",
      "Spiegel",
      "Toiletartikelen"
    ]
  },
  "Slaapkamer": { 
    showIkea: true,
    suggestions: [
      "Bed en matras",
      "Dekbed en kussens",
      "Beddengoed (lakens, dekbedovertrekken)",
      "Nachtkastjes",
      "Kledingkast of -rek",
      "Verduisterende gordijnen",
      "Nachtlampje",
      "Spiegels"
    ]
  },
  "Werk-/Gamehoek": { 
    showIkea: true,
    suggestions: [
      "Bureau en bureaustoel",
      "Monitorstandaard of -arm",
      "Kabelmanagement",
      "Bureaulamp",
      "Opbergsysteem",
      "Boekenplank",
      "Netwerkapparatuur",
      "Stekkerdozen"
    ]
  },
  "Overig huishouden": { 
    showIkea: true,
    suggestions: [
      "Stofzuiger",
      "Dweil en emmer",
      "Schoonmaakmiddelen",
      "Wasmiddel en -verzachter",
      "Wasrek",
      "Strijkplank en -ijzer",
      "EHBO-set",
      "Gereedschapskist"
    ]
  },
  "Nutsvoorzieningen & administratie": { 
    showIkea: false,
    suggestions: [
      "Energiecontract afsluiten",
      "Wateraansluiting regelen",
      "Internet abonnement",
      "Inschrijven gemeente",
      "Inboedelverzekering",
      "Post doorsturen",
      "Adreswijziging doorgeven",
      "TV/streaming abonnementen"
    ]
  }
};