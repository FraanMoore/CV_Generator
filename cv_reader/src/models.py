from __future__ import annotations

from typing import Dict, List, Optional
from pydantic import BaseModel


class TitleI18n(BaseModel):
  es: str
  en: str


class LocationI18n(BaseModel):
  es: str
  en: str

class LinkI18n(BaseModel):
  es: str
  en: str

class Links(BaseModel):
  linkedin: LinkI18n
  github: str


class Contact(BaseModel):
  phone: str
  email: str
  links: Links
  location: LocationI18n


class Profile(BaseModel):
  name: str
  title: TitleI18n
  contact: Contact


class SummaryI18n(BaseModel):
  es: List[str]
  en: List[str]


class ExperienceBulletsI18n(BaseModel):
  es: List[str]
  en: List[str]


class RoleI18n(BaseModel):
  es: str
  en: str


class Experience(BaseModel):
  company: str
  location: LocationI18n
  role: RoleI18n
  start_year: int
  end_year: int
  bullets: ExperienceBulletsI18n
  tags: List[str] = []


class DegreeI18n(BaseModel):
  es: str
  en: str


class Education(BaseModel):
  degree: DegreeI18n
  institution: str
  year: int
  location: LocationI18n


class Skills(BaseModel):
  core: List[str] = []
  apis: List[str] = []
  tooling: List[str] = []


class LanguageLevelI18n(BaseModel):
  es: str
  en: str


class Language(BaseModel):
  name: str
  level: LanguageLevelI18n


class CVMaster(BaseModel):
  meta: Dict[str, object]
  profile: Profile
  summary: SummaryI18n
  experience: List[Experience]
  education: List[Education]
  skills: Skills
  languages: List[Language]
