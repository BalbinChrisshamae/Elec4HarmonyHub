-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 03, 2024 at 06:55 AM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `forumdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `category_tbl`
--

CREATE TABLE `category_tbl` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `description` varchar(100) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `delete_flag` tinyint(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `category_tbl`
--

INSERT INTO `category_tbl` (`id`, `name`, `description`, `status`, `delete_flag`, `created_at`, `updated_at`) VALUES
(6, 'Piano', '', 1, 0, '2022-08-22 12:58:36', '2022-08-22 12:58:36'),
(7, 'Guitar', '', 1, 0, '2022-08-22 12:58:36', '2022-08-22 12:58:36'),
(8, 'Drums', '', 1, 0, '2022-08-22 12:58:36', '2022-08-22 12:58:36'),
(9, 'Violin', '', 1, 0, '2022-08-22 12:58:36', '2022-08-22 12:58:36');

-- --------------------------------------------------------

--
-- Table structure for table `comment_tbl`
--

CREATE TABLE `comment_tbl` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `comment_tbl`
--

INSERT INTO `comment_tbl` (`id`, `user_id`, `post_id`, `comment`, `created_at`) VALUES
(2, 10, 1, 'I don\'t use it much now but even when it was my main guitar the battery lasted a couple of years. It never actually needed a new battery I just don\'t like leaving it in too long in case it leaks.', '2022-08-31 06:17:48'),
(3, 20, 1, 'Ah! Needs a new set of machines. These are worn and have a dead spot JUST where it is bang in tune! How much should I pay for a decent set?', '2022-08-31 06:19:48'),
(4, 23, 1, 'I’m assuming it’s the old J-bass copy he’s mentioned recently, so will be 4-in-line.', '2022-08-31 06:21:19'),
(5, 21, 2, 'Tuning is typically \'stretched\' to make it sound subjectively correct. So using any tuner alone is not going to get the result you want. Tuning by ear is essential to the task.', '2022-08-31 06:26:18'),
(6, 22, 2, 'I\'ll choose Smartphone!.', '2022-08-31 06:27:46'),
(7, 20, 3, 'That\'s pretty impressive Dustin!', '2022-08-31 06:31:06'),
(8, 24, 3, 'fewfervrf', '2023-12-27 04:52:24');

-- --------------------------------------------------------

--
-- Table structure for table `post_tbl`
--

CREATE TABLE `post_tbl` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `content` text DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `delete_flag` tinyint(1) NOT NULL DEFAULT 0,
  `images` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `post_tbl`
--

INSERT INTO `post_tbl` (`id`, `user_id`, `category_id`, `title`, `content`, `status`, `delete_flag`, `images`, `created_at`, `updated_at`) VALUES
(1, 22, 7, 'Active Guitars', 'During a conversation with son last night these came up and I mean \'solid electric active\' guitars, not acoustics. What was the idea behind them and why do they seem to have gone out of favour?\r\n\r\nAny links to schematics greatly \'preciated.', 1, 0, '', '2022-08-31 06:14:12', '2022-08-31 06:14:12'),
(2, 10, 6, 'piano tuning: smartphone or battery-operated tuner', 'I would like to ask if some still prefer the old Korg/Yamaha tuners when tuning upright and grand pianos. Or do many here believe that smartphones do the job just fine? \r\nOf course using a cellphone is an obvious choice, but one time I used my phone to tune a whole piano, it yielded underwhelming results, and I ended up turning it off with 2 octaves on the furthest sides still left to tune.', 1, 0, '', '2022-08-31 06:25:27', '2022-08-31 06:25:27'),
(3, 23, 8, 'Yoshimi Ride Cymbal', 'This is a demo of the new addition to the Drums bank simply called \'Ride\'\r\nThe first part of the demo is with all \'hits\' being C1 note. The second part is a random selection from C0 to C2. Even when you do hit the same note you don\'t always get exactly the same sound :)\r\n\r\nwww.musically.me.uk/themainevent/Ride.wav', 1, 0, '', '2022-08-31 06:30:10', '2022-08-31 06:30:10'),
(4, 22, 9, 'Violin Lesson Book or Youtube?', 'I want your opinion guys.', 1, 0, '', '2022-08-31 06:34:11', '2022-08-31 06:34:11'),
(7, 25, 7, 'hehehhehe', 'csxs d ', 1, 0, '', '2023-12-29 06:02:17', '2023-12-29 06:02:17'),
(13, 20, 8, 'dvfe', 'vfvfb', 1, 0, NULL, '2023-12-30 13:57:53', '2023-12-30 13:57:53'),
(14, 20, 7, 'f g', 'g bg ', 1, 0, 'Screenshot (415).png', '2023-12-30 14:12:13', '2023-12-30 14:12:13'),
(15, 20, 7, 'cd', 'f f', 1, 0, NULL, '2023-12-30 14:13:38', '2023-12-30 14:13:38'),
(16, 20, 7, 'bvhg', 'yiggygyuu', 1, 0, NULL, '2024-01-03 00:11:39', '2024-01-03 00:11:39');

-- --------------------------------------------------------

--
-- Table structure for table `user_tbl`
--

CREATE TABLE `user_tbl` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `firstname` varchar(50) DEFAULT NULL,
  `middlename` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `type` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_tbl`
--

INSERT INTO `user_tbl` (`id`, `email`, `firstname`, `middlename`, `lastname`, `password`, `avatar`, `type`, `created_at`, `updated_at`) VALUES
(8, '1', 'admin', 'admin', 'admin', 'admin', '2', 1, '2022-08-24 13:52:11', '2024-01-03 00:41:45'),
(10, '3', 'deoff', 'redoble', 'torrado', '1234', '20-UR-1158.jpg', 0, '2022-08-30 00:25:17', '2024-01-03 00:41:45'),
(20, 'm@gmail.com', 'Chrissha sdbch', 'Helloo ehvc', 'Balbin', '$argon2id$v=19$m=65536,t=3,p=4$yM8JwZ7hd5gx92iblXY0Hw$UW/sWVDVX8YigbbngBQ3RiiRWw+kh4G6h95PiatiPNQ', 'Jose.jpg', 0, '2022-08-30 14:03:34', '2024-01-03 04:37:56'),
(21, '5', 'Royce', 'Pogi', 'Hortaleza', '123456789', 'royce.jpeg', 0, '2022-08-30 14:07:46', '2024-01-03 00:41:45'),
(22, '6', 'Mark', 'pogi', 'Andaya', '123456789', 'mark.jpg', 0, '2022-08-31 03:08:41', '2024-01-03 00:41:45'),
(23, '7', 'Justin', 'Pogi', 'Antinew', '123456789', 'justin.jpg', 0, '2022-08-31 05:28:34', '2024-01-03 00:41:45'),
(24, '8', 'Chrissha Mae', 'Espenueva', 'Balbin', '12345678', 'Ariane.jpg', 0, '2023-12-27 04:51:24', '2024-01-03 00:41:45'),
(25, '9', 'Chrissha Maeeee', 'Espenueva', 'Balbin', '12345678', 'April.jpg', 0, '2023-12-29 04:03:59', '2024-01-03 00:41:45'),
(26, 'marlon@gmail.com', 'marlon ', 'wala', 'Castillo', '$argon2id$v=19$m=65536,t=3,p=4$Xjmq7GtQY5mQcp4pFl6mLA$71T8nTo6RfYiGDlm1sE4wYxGgLX6pH7/jJtJR2d2Nus', 'Jose.jpg', 0, '2024-01-03 05:39:54', '2024-01-03 05:39:54'),
(28, 'c@gmail.com', 'Chrissha Mae jgghbfdjsd', 'Espenueva', 'Balbin', '$argon2id$v=19$m=65536,t=3,p=4$Xzy3ZWSqtQEZnoemhA9sgg$z0d+qEKFvBYzoeXhVboIsHAiks4v9NNOwbIBnRggS4o', 'Ian.jpg', 0, '2024-01-03 05:41:05', '2024-01-03 05:41:05');

-- --------------------------------------------------------

--
-- Table structure for table `views`
--

CREATE TABLE `views` (
  `viesno` int(11) NOT NULL,
  `plusone` int(11) NOT NULL,
  `postid` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `views`
--

INSERT INTO `views` (`viesno`, `plusone`, `postid`, `date_created`) VALUES
(1, 1, 3, '2023-12-29 14:13:10'),
(2, 1, 3, '2023-12-29 14:13:10');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category_tbl`
--
ALTER TABLE `category_tbl`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comment_tbl`
--
ALTER TABLE `comment_tbl`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `post_id` (`post_id`);

--
-- Indexes for table `post_tbl`
--
ALTER TABLE `post_tbl`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user_tbl`
--
ALTER TABLE `user_tbl`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `views`
--
ALTER TABLE `views`
  ADD PRIMARY KEY (`viesno`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category_tbl`
--
ALTER TABLE `category_tbl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `comment_tbl`
--
ALTER TABLE `comment_tbl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `post_tbl`
--
ALTER TABLE `post_tbl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `user_tbl`
--
ALTER TABLE `user_tbl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `views`
--
ALTER TABLE `views`
  MODIFY `viesno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comment_tbl`
--
ALTER TABLE `comment_tbl`
  ADD CONSTRAINT `comment_tbl_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_tbl` (`id`),
  ADD CONSTRAINT `comment_tbl_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `post_tbl` (`id`);

--
-- Constraints for table `post_tbl`
--
ALTER TABLE `post_tbl`
  ADD CONSTRAINT `post_tbl_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_tbl` (`id`),
  ADD CONSTRAINT `post_tbl_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `category_tbl` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
