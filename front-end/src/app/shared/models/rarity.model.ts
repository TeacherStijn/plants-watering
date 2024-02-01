// Geen Enum ivm String only, geen objects erin mogelijk
export class Rarity {
  static readonly COMMON = new Rarity('COMMON', { color: 'gray', aankoopPrijsSeed: 1, plantModifier: 3 });
  static readonly UNCOMMON = new Rarity('UNCOMMON', { color: 'yellow', aankoopPrijsSeed: 5, plantModifier: 3 });
  static readonly RARE = new Rarity('RARE', { color: 'brown', aankoopPrijsSeed: 10, plantModifier: 4 });
  static readonly EPIC = new Rarity('EPIC', { color: 'purple', aankoopPrijsSeed: 40, plantModifier: 4 });
  static readonly LEGENDARY = new Rarity('LEGENDARY', { color: 'orange', aankoopPrijsSeed: 100, plantModifier: 5 });

  private constructor(private readonly key: string, public readonly value: { color: string, aankoopPrijsSeed: number, plantModifier: number}) {

  }

  toString(): string {
    return this.key;
  }
}
