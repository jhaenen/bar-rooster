export interface Wedstrijd {
  wedstrijddatum:           string;
  wedstrijdcode:            number;
  wedstrijdnummer:          number;
  teamnaam:                 string;
  thuisteamclubrelatiecode: Thuisteamclubrelatiecode;
  uitteamclubrelatiecode:   string;
  thuisteamid:              number;
  thuisteam:                string;
  thuisteamlogo:            string;
  uitteamid:                number;
  uitteam:                  string;
  uitteamlogo:              string;
  teamvolgorde:             number;
  competitiesoort:          Competitiesoort;
  competitie:               string;
  klasse:                   Klasse;
  poule:                    string;
  klassepoule:              string;
  kaledatum:                Date;
  datum:                    string;
  vertrektijd:              string;
  verzameltijd:             Verzameltijd;
  aanvangstijd:             string;
  wedstrijd:                string;
  status:                   Status;
  scheidsrechters:          string;
  scheidsrechter:           string;
  accommodatie:             Accommodatie;
  veld:                     Veld;
  locatie:                  Locatie;
  plaats:                   Plaats;
  rijders:                  null;
  kleedkamerthuisteam:      string;
  kleedkameruitteam:        string;
  kleedkamerscheidsrechter: string;
  meer:                     string;
}

export enum Accommodatie {
  KorbaSporthal = "Korba sporthal",
}

export enum Competitiesoort {
  Regulier = "regulier",
}

export enum Klasse {
  The1EDivisie = "1e Divisie",
  The2EDivisie = "2e divisie",
  The3EDivisie = "3e divisie",
  The4EDivisie = "4e divisie",
  The5EDivisie = "5e divisie",
}

export enum Locatie {
  Basketball = "Basketball",
}

export enum Plaats {
  Delft = "DELFT",
}

export enum Status {
  TeSpelen = "Te spelen",
}

export enum Thuisteamclubrelatiecode {
  D1C9F3N = "D1C9F3N",
}

export enum Veld {
  CenterCourt = "Center court",
  Veld1 = "Veld 1",
  Veld2 = "Veld 2",
}

export enum Verzameltijd {
  Empty = "",
  The1745 = "17:45",
  The1815 = "18:15",
}
