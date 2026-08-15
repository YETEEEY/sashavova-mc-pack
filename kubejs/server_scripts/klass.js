// Выбор класса на старте — сборка Саши и Вовы
// Меню появляется при первом входе в мир. Класс выбирается один раз.

const CLASSES = {
  engineer: {
    name: '§6Инженер',
    desc: 'Шахты, механизмы, руда. Быстрее копает, видит больше в темноте.',
    kit: [
      'minecraft:iron_pickaxe', 'minecraft:torch 32', 'minecraft:bread 16',
      'minecraft:oak_planks 32', 'minecraft:crafting_table'
    ],
    effects: [['minecraft:haste', 1], ['minecraft:night_vision', 0]]
  },
  warrior: {
    name: '§cВоин',
    desc: 'Ближний бой, броня, боссы. Больше здоровья и урона.',
    kit: [
      'minecraft:iron_sword', 'minecraft:shield', 'minecraft:cooked_beef 16',
      'minecraft:leather_chestplate', 'minecraft:leather_helmet'
    ],
    effects: [['minecraft:health_boost', 1], ['minecraft:resistance', 0]]
  },
  mage: {
    name: '§5Маг',
    desc: 'Заклинания, посохи, мана. Быстрее восстанавливается, дальше видит.',
    kit: [
      'minecraft:book', 'minecraft:lapis_lazuli 16', 'minecraft:bread 16',
      'minecraft:stick 8', 'minecraft:golden_apple'
    ],
    effects: [['minecraft:regeneration', 0], ['minecraft:night_vision', 0]]
  },
  ranger: {
    name: '§aСледопыт',
    desc: 'Лук, скорость, разведка. Бегает быстрее, прыгает выше.',
    kit: [
      'minecraft:bow', 'minecraft:arrow 64', 'minecraft:cooked_chicken 16',
      'minecraft:leather_boots', 'minecraft:map'
    ],
    effects: [['minecraft:speed', 0], ['minecraft:jump_boost', 0]]
  },
  keeper: {
    name: '§2Хранитель',
    desc: 'Ферма, звери, выживание. Меньше голодает, больше сил.',
    kit: [
      'minecraft:iron_hoe', 'minecraft:wheat_seeds 16', 'minecraft:bread 24',
      'minecraft:water_bucket', 'minecraft:oak_sapling 8'
    ],
    effects: [['minecraft:saturation', 0], ['minecraft:strength', 0]]
  }
}

function showMenu(player) {
  player.tell(Text.of(''))
  player.tell(Text.gold('══════════════════════════════'))
  player.tell(Text.gold('  Выбери свой путь').bold(true))
  player.tell(Text.gray('  Класс выбирается один раз. Он даёт стартовый'))
  player.tell(Text.gray('  набор и бонусы, но ни во что тебя не запирает.'))
  player.tell(Text.of(''))
  Object.keys(CLASSES).forEach(key => {
    let c = CLASSES[key]
    player.tell(
      Text.of('  ')
        .append(Text.of('[ ' + c.name + ' §f]').bold(true)
          .click('/klass ' + key)
          .hover(Text.gray(c.desc + '\n\n§eНажми, чтобы выбрать')))
        .append(Text.gray('  ' + c.desc))
    )
  })
  player.tell(Text.of(''))
  player.tell(Text.gray('  Если меню пропало — введи §f/klass'))
  player.tell(Text.gold('══════════════════════════════'))
  player.tell(Text.of(''))
}

function applyClass(player, key) {
  let c = CLASSES[key]
  if (!c) return false
  c.kit.forEach(s => {
    try { player.give(Item.of(s)) } catch (e) { console.warn('klass: не удалось выдать ' + s) }
  })
  c.effects.forEach(e => {
    try { player.potionEffects.add(e[0], 20 * 60 * 30, e[1], false, false) } catch (err) { }
  })
  player.persistentData.putString('sv_class', key)
  player.tell(Text.of(''))
  player.tell(Text.of('  Твой путь: ').append(Text.of(c.name).bold(true)))
  player.tell(Text.gray('  ' + c.desc))
  player.tell(Text.gray('  Стартовый набор выдан. Бонусы класса активны.'))
  player.tell(Text.of(''))
  player.server.tell(Text.gray('  ' + player.username + ' выбрал путь: ').append(Text.of(c.name)))
  return true
}

PlayerEvents.loggedIn(event => {
  const player = event.player
  player.server.scheduleInTicks(60, () => {
    if (!player.persistentData.contains('sv_class')) {
      showMenu(player)
    } else {
      let c = CLASSES[player.persistentData.getString('sv_class')]
      if (c) player.tell(Text.gray('С возвращением. Твой путь: ').append(Text.of(c.name)))
    }
  })
})

ServerEvents.commandRegistry(event => {
  const { commands: Commands, arguments: Arguments } = event
  event.register(
    Commands.literal('klass')
      .executes(ctx => {
        let p = ctx.source.player
        if (p.persistentData.contains('sv_class')) {
          let c = CLASSES[p.persistentData.getString('sv_class')]
          p.tell(Text.of('Твой путь: ').append(Text.of(c ? c.name : '§7неизвестен')))
          p.tell(Text.gray('Сменить путь нельзя — это осознанный выбор.'))
        } else {
          showMenu(p)
        }
        return 1
      })
      .then(Commands.argument('path', Arguments.STRING.create(event))
        .executes(ctx => {
          let p = ctx.source.player
          let key = Arguments.STRING.getResult(ctx, 'path')
          if (p.persistentData.contains('sv_class')) {
            p.tell(Text.red('Ты уже выбрал путь.'))
            return 0
          }
          if (!applyClass(p, key)) {
            p.tell(Text.red('Нет такого пути.'))
            return 0
          }
          return 1
        }))
  )
})
