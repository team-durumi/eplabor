# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "mozodev/xenial64-anyenv"
  config.vm.network "forwarded_port", guest: 1313, host: 1313
  config.vm.network "private_network", ip: "192.168.40.10"
  # config.vm.synced_folder "../data", "/vagrant_data"
  config.vm.synced_folder ".", "/vagrant", nfs: true, fsnotify: true, exclude: ["node_modules"]
  config.notify_forwarder.enable = false

  config.vm.provider "virtualbox" do |vb|
    vb.name = "eplabor"
    vb.memory = "2048"
    vb.linked_clone = true
  end

  config.vagrant.plugins = ["vagrant-fsnotify"]
  config.trigger.after :up do |t|
    t.name = "vagrant-fsnotify"
    t.run = { inline: "vagrant fsnotify" }
  end
  
end
