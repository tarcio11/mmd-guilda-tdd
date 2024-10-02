type Permission = 'crmo' | 'doctor' | 'admin' | 'patient'

export class User {
  userId: string;
  permission: Permission

  constructor (userId: string, permission: Permission) {
    this.userId = userId
    this.permission = permission
  }

  canCancelOrder () {
    return this.permission === 'crmo' || this.permission === 'admin'
  }
};
