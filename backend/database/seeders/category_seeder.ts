import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '../../app/models/category.js'

export default class extends BaseSeeder {
  async run() {
    const categories = [
      { name: 'Food & Dining' },
      { name: 'Transportation' },
      { name: 'Shopping' },
      { name: 'Entertainment' },
      { name: 'Bills & Utilities' },
      { name: 'Healthcare' },
      { name: 'Education' },
      { name: 'Travel' },
      { name: 'Other' },
    ]

    for (const category of categories) {
      await Category.firstOrCreate({ name: category.name }, category)
    }
  }
}
