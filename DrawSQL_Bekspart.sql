-- ============================================================
-- DrawSQL Prompt - BEKSPART (Booking Sparepart Scooter)
-- Copy paste ke drawSQL > Import SQL
-- ============================================================

CREATE TABLE `users` (
  `id`         INT            NOT NULL AUTO_INCREMENT,
  `nama`       VARCHAR(100)   NOT NULL,
  `email`      VARCHAR(100)   NOT NULL UNIQUE,
  `password`   VARCHAR(255)   NOT NULL,
  `no_telp`    VARCHAR(20)    NULL,
  `alamat`     TEXT           NULL,
  `role`       ENUM('user','admin') NOT NULL DEFAULT 'user',
  `created_at` TIMESTAMP      NULL,
  `updated_at` TIMESTAMP      NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `spareparts` (
  `id`         INT             NOT NULL AUTO_INCREMENT,
  `kode`       VARCHAR(50)     NOT NULL UNIQUE,
  `nama`       VARCHAR(150)    NOT NULL,
  `deskripsi`  TEXT            NULL,
  `harga`      DECIMAL(12,2)   NOT NULL,
  `stok`       INT             NULL DEFAULT 0,
  `satuan`     VARCHAR(20)     NULL,
  `gambar`     VARCHAR(255)    NULL,
  `is_active`  BOOLEAN         NULL DEFAULT TRUE,
  `created_at` TIMESTAMP       NULL,
  `updated_at` TIMESTAMP       NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `bookings` (
  `id`              INT             NOT NULL AUTO_INCREMENT,
  `nomor_booking`   VARCHAR(50)     NOT NULL UNIQUE,
  `user_id`         INT             NOT NULL,
  `tanggal_booking` DATE            NOT NULL,
  `tanggal_ambil`   DATE            NOT NULL,
  `status`          ENUM('menunggu','dikonfirmasi','siap_diambil','selesai','dibatalkan') NOT NULL DEFAULT 'menunggu',
  `total_harga`     DECIMAL(14,2)   NULL DEFAULT 0,
  `catatan`         TEXT            NULL,
  `catatan_admin`   TEXT            NULL,
  `created_at`      TIMESTAMP       NULL,
  `updated_at`      TIMESTAMP       NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);

CREATE TABLE `detail_transaksi` (
  `id`             INT             NOT NULL AUTO_INCREMENT,
  `transaksi_id`   INT             NOT NULL,
  `sparepart_id`   INT             NOT NULL,
  `nama_sparepart` VARCHAR(150)    NOT NULL,
  `jumlah`         INT             NOT NULL,
  `harga_satuan`   DECIMAL(12,2)   NOT NULL,
  `subtotal`       DECIMAL(14,2)   NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`transaksi_id`) REFERENCES `transaksi`  (`id`),
  FOREIGN KEY (`sparepart_id`) REFERENCES `spareparts` (`id`)
);

CREATE TABLE `transaksi` (
  `id`              INT             NOT NULL AUTO_INCREMENT,
  `kode_transaksi`  VARCHAR(50)     NOT NULL UNIQUE,
  `booking_id`      INT             NOT NULL,
  `user_id`         INT             NOT NULL,
  `tanggal_transaksi` DATE          NOT NULL,
  `total_bayar`     DECIMAL(14,2)   NOT NULL,
  `metode_bayar`    VARCHAR(50)     NULL,
  `status_bayar`    ENUM('belum_bayar','lunas') NOT NULL DEFAULT 'belum_bayar',
  `catatan`         TEXT            NULL,
  `created_at`      TIMESTAMP       NULL,
  `updated_at`      TIMESTAMP       NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  FOREIGN KEY (`user_id`)    REFERENCES `users`    (`id`)
);
