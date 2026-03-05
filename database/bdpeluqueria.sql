-- =====================================================
-- CREAR ESQUEMA
-- =====================================================
CREATE SCHEMA IF NOT EXISTS `peluqueriabd3`
DEFAULT CHARACTER SET utf8mb4
COLLATE utf8mb4_spanish_ci;

USE `peluqueriabd3`;

-- =====================================================
-- ROLES
-- =====================================================
CREATE TABLE roles (
  idRoles INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombreRol VARCHAR(20) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- =====================================================
-- USUARIOS
-- =====================================================
CREATE TABLE usuarios (
  idUsuarios INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre1 VARCHAR(45) NOT NULL,
  nombre2 VARCHAR(45) NULL,
  apellido1 VARCHAR(45) NOT NULL,
  apellido2 VARCHAR(45) NULL,
  ciUsuario VARCHAR(20) NOT NULL UNIQUE,
  celularUsuario VARCHAR(15) NOT NULL UNIQUE,
  password VARCHAR(200) NOT NULL,
  Roles_idRoles INT UNSIGNED NOT NULL,
  CONSTRAINT fk_usuario_rol
    FOREIGN KEY (Roles_idRoles)
    REFERENCES roles(idRoles)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- DISPONIBILIDADES (HORARIO DEL EMPLEADO)
-- =====================================================
CREATE TABLE disponibilidades (
  idDisponibilidad INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  empleado_id INT UNSIGNED NOT NULL,
  fecha DATE NOT NULL,
  horaInicio TIME NOT NULL,
  horaFin TIME NOT NULL,
  CONSTRAINT fk_disponibilidad_empleado
    FOREIGN KEY (empleado_id)
    REFERENCES usuarios(idUsuarios)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- SERVICIOS
-- =====================================================
CREATE TABLE servicios (
  idServicios INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombreServicio VARCHAR(25) NOT NULL,
  costoServicio DOUBLE NOT NULL,
  duracionMinutos INT NOT NULL,
  descripcionServicio TEXT NULL
) ENGINE=InnoDB;

-- =====================================================
-- SERVICIOS POR EMPLEADO
-- =====================================================
CREATE TABLE servicios_empleados (
  servicio_id INT UNSIGNED NOT NULL,
  empleado_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (servicio_id, empleado_id),
  CONSTRAINT fk_servicio_empleado_servicio
    FOREIGN KEY (servicio_id)
    REFERENCES servicios(idServicios)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_servicio_empleado_empleado
    FOREIGN KEY (empleado_id)
    REFERENCES usuarios(idUsuarios)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- RESERVAS / CITAS
-- =====================================================
CREATE TABLE reservas (
  idReservas INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT UNSIGNED NOT NULL,
  disponibilidad_id INT UNSIGNED NOT NULL,
  horaInicio TIME NOT NULL,
  horaFin TIME NOT NULL,
  detalle TEXT NULL,
  estado ENUM('pendiente','confirmada','atendida','cancelada') DEFAULT 'pendiente',
  CONSTRAINT fk_reserva_cliente
    FOREIGN KEY (cliente_id)
    REFERENCES usuarios(idUsuarios)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_reserva_disponibilidad
    FOREIGN KEY (disponibilidad_id)
    REFERENCES disponibilidades(idDisponibilidad)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- SERVICIOS DE LA RESERVA
-- =====================================================
CREATE TABLE reservas_servicios (
  reserva_id INT UNSIGNED NOT NULL,
  servicio_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (reserva_id, servicio_id),
  CONSTRAINT fk_reserva_servicio_reserva
    FOREIGN KEY (reserva_id)
    REFERENCES reservas(idReservas)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_reserva_servicio_servicio
    FOREIGN KEY (servicio_id)
    REFERENCES servicios(idServicios)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- CAJA (INGRESOS Y EGRESOS)
-- =====================================================
CREATE TABLE caja (
  idCaja INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('ingreso','egreso') NOT NULL,
  concepto VARCHAR(100) NOT NULL,
  monto DOUBLE NOT NULL,
  metodo ENUM('efectivo','qr','tarjeta') NOT NULL,
  fecha DATETIME NOT NULL,
  usuario_id INT UNSIGNED NOT NULL,
  reserva_id INT UNSIGNED NULL,
  CONSTRAINT fk_caja_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(idUsuarios)
    ON DELETE CASCADE,
  CONSTRAINT fk_caja_reserva
    FOREIGN KEY (reserva_id)
    REFERENCES reservas(idReservas)
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- =====================================================
-- EMPRESA
-- =====================================================
CREATE TABLE empresa (
  idEmpresa INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombreEmpresa VARCHAR(45) NOT NULL,
  imageLogo VARCHAR(60) NULL,
  imageQR VARCHAR(60) NULL,
  numeroE VARCHAR(15) NULL,
  correoE VARCHAR(30) NULL,
  direccionE VARCHAR(100) NULL
) ENGINE=InnoDB;