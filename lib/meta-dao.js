const Meta = require('./meta')
class MetaDAO {
    async getAll(skip=0, limit=100) {
        return Meta.find().skip(skip).limit(limit).exec()
    }
    async getByGenre( genre, skip=0, limit=100) {
        return Meta.find({ genres: genre }).skip(skip).limit(limit).exec()
    }
    async getByName(name, skip=0, limit=100) {
        return Meta.find({ name: { $regex: name, $options: 'i' } }).skip(skip).limit(limit).exec()
    }
    async getById(id) {
        return Meta.findOne({ id: id }).exec()
    }
    async getBySlug(slug) {
        return Meta.findOne({ slug: slug }).exec()
    }
    async add(meta) {
        return (new Meta(meta)).save()
    }
    async addIfAbsent(meta) {
        let exists = await this.getBySlug(meta.slug)
        if (exists != null) {
            return exists
        }
        else {
            return this.add(meta)
        }
    }
    async update(meta) {
        return Meta.updateOne({ id: meta.id }, meta).exec()
    }
    async upsert(meta) {
        let exists = await this.getById(meta.id)
        if (exists != null) {
            console.log(`Update: ${meta.name}`)
            return this.update(meta)
        }
        else {
            console.log(`Add: ${meta.name}`)
            return this.add(meta)
        }
    }
}

module.exports = MetaDAO